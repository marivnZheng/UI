<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFriendStore } from '@/store/modules/friend';
import { useMessage } from 'naive-ui';
import { listGroupAll, sendMessage } from '@/api/friend';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import { Add } from '@vicons/ionicons5';
import moment from 'moment-timezone';

let props = defineProps({
  messageShowFlag: Number,
  sysConcatsList: Array<String>,
  memberTotalDataSource: Array<any>,
});
const friendStore = useFriendStore();
const message = useMessage();

let active = ref<Boolean>(false);

let headers = ref({
  Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
});

let groupLoading = ref(false);

let confirmBtnLoading = ref<Boolean>(false);

let formValue = ref({
  accountList: Array.from(
    friendStore.accountList.filter((item) => item.sysAccountId == friendStore.currentSysAccountId)
  ),
  groupList: [],
  messageGroup: [
    {
      fileList: [],
      fileName: '',
      message: '',
    },
  ],
  sendMethod: '1',
  min: '0',
  minCount: 6,
  hour: '1',
  hourCount: 10,
  startTime: undefined,
  endTime: undefined,
  endDate: undefined,
  selectOption: '0',
  sysConcatsList: [],
});

const rules = {
  // account: {
  //   // required: true,
  //   message: '请选择账号',
  //   trigger: ['change'],
  // },
  username: {
    required: true,
    message: '请输入',
    trigger: ['input'],
  },
};

let objectSelect = ref<String>('user');
const objectOptions = [
  {
    label: '用户',
    value: 'user',
  },
  {
    label: '群组',
    value: 'group',
  },
];

let groupList = ref<Array<any>>([]);
let startIndex = ref<Number>();
let endIndex = ref<Number>();

const selectedOption = ref<String>('chap1');
const tabs = ref([
  { name: 'chap1', label: '单次发送' },
  { name: 'chap2', label: '循环发送' },
]);

const singleIntervalOptions = [
  {
    label: '秒',
    value: '0',
  },
  {
    label: '分',
    value: '1',
  },
];

const loopIntervalOptions = [
  {
    label: '分',
    value: '1',
  },
  {
    label: '时',
    value: '2',
  },
];

async function loadGroupOptions() {
  groupLoading.value = true;

  if (friendStore.currentSysAccountId === '') {
    groupLoading.value = false;
    return;
  }

  let queryParams = { sysAccountStringSession: '' };

  friendStore.accountList.forEach((e) => {
    if (friendStore.currentSysAccountId === e.sysAccountId)
      queryParams.sysAccountStringSession = e.sysAccountStringSession;
  });

  return await listGroupAll(queryParams).then(async (response) => {
    groupList.value = response.data.rows;
    groupLoading.value = false;
  });
}

async function handleSelectAll() {
  if (objectSelect.value == 'user') {
    formValue.value.sysConcatsList = [];
    props.memberTotalDataSource.forEach((item) =>
      formValue.value.sysConcatsList.push(item.sysContactId)
    );
  }
}

async function handleSelectIndex() {
  await loadGroupOptions();
}

function popconfirm() {
  for (
    let i = startIndex.value - 1;
    i < props.memberTotalDataSource.length && i < endIndex.value;
    i++
  ) {
    formValue.value.sysConcatsList.push(props.memberTotalDataSource[i].sysContactId);
  }
}

function changeTab(e) {
  selectedOption.value = e;
  formValue.value.sendMethod = e == 'chap1' ? '1' : '2';
}

async function sendMsg() {
  confirmBtnLoading.value = true;

  formValue.value.messageGroup.forEach((e) => {
    if (e.fileList.length > 0) {
      e.fileName = e.fileList[0].name;
    }
  });
  formValue.value.startTime =
    formValue.value.startTime == undefined
      ? ''
      : moment.utc(formValue.value.startTime).toISOString();
  formValue.value.endTime =
    formValue.value.endTime == undefined ? '' : moment.utc(formValue.value.endTime).toISOString();
  formValue.value.endDate =
    formValue.value.endDate == undefined ? '' : moment.utc(formValue.value.endDate).toISOString();

  await sendMessage(formValue.value).then((res) => {
    if (res.data.code == 200) {
      confirmBtnLoading.value = false;
      message.success('成功添加任务');
      active.value = false;
    } else message.error(res.data.msg);
  });
}

watch(
  () => props.messageShowFlag,
  () => {
    active.value = true;
  }
);

watch(
  () => props.sysConcatsList,
  async (newValue) => {
    formValue.value.sysConcatsList = newValue;
  }
);

watch(
  () => friendStore.currentSysAccountId,
  () => {
    formValue.value.accountList = Array.from(
      friendStore.accountList.filter((item) => item.sysAccountId == friendStore.currentSysAccountId)
    );
  }
);
</script>

<template>
  <n-drawer v-model:show="active"
            :width="502"
            placement="right">
    <n-drawer-content title="发送消息">
      <n-form ref="formRef"
              :model="formValue"
              :rules="rules"
              require-mark-placement="left">
        <div>
          账号
          <n-divider vertical />
          <n-button quaternary
                    type="primary"
                    @click="handleSelectAll">全选</n-button>
          <n-popconfirm :show-icon="false"
                        :on-positive-click="popconfirm">
            <template #trigger>
              <n-button quaternary
                        type="primary"
                        @click="handleSelectIndex">自选数量</n-button>
            </template>
            共{{ props.memberTotalDataSource.length }}个
            <n-divider vertical />
            <n-input-number v-model:value="startIndex"
                            placeholder="开始下标"
                            :min="1"
                            :max="props.memberTotalDataSource.length"
                            style="width: 120px" />
            &nbsp;~&nbsp;
            <n-input-number v-model:value="endIndex"
                            placeholder="结束下标"
                            :min="startIndex"
                            :max="props.memberTotalDataSource.length"
                            style="width: 120px" />
          </n-popconfirm>
        </div>
        <n-grid :cols="5">
          <n-form-item-gi :span="1">
            <n-select v-model:value="objectSelect"
                      label-field="label"
                      value-field="value"
                      disabled
                      :options="objectOptions" />
          </n-form-item-gi>

          <n-form-item-gi :span="4"
                          path="sysConcatsList">
            <n-select v-model:value="formValue.sysConcatsList"
                      label-field="sysContactName"
                      value-field="sysContactId"
                      multiple
                      :options="props.memberTotalDataSource"
                      :max-tag-count="1"
                      clearable />
          </n-form-item-gi>
        </n-grid>

        <div v-for="(item, index) in formValue.messageGroup"
             :key="index">
          <n-form-item label="消息图片"
                       path="messageGroup[${index}].fileList">
            <n-upload action="/backApi/system/account/sessionFileUpload"
                      v-model:file-list="formValue.messageGroup[index].fileList"
                      list-type="image-card"
                      :max="1"
                      accept="image/jpg,image/jpeg,image/png"
                      :headers="headers" />
          </n-form-item>
          <n-form-item label="消息内容"
                       path="messageGroup[${index}].message">
            <n-input v-model:value="formValue.messageGroup[index].message"
                     type="textarea"
                     placeholder="请编辑你的内容" />
          </n-form-item>
        </div>

        <n-button type="primary"
                  @click="formValue.messageGroup.push({ fileList: [], fileName: '', message: '' })"
                  style="margin-bottom: 20px; border-radius: 8px">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          新增消息组
        </n-button>

        <n-form-item label="发送方式"
                     path="sendMethod">
          <n-tabs type="segment"
                  animated
                  size="small"
                  :on-update-value="changeTab">
            <n-tab v-for="(tab, index) in tabs"
                   :label="tab.label"
                   :key="index"
                   :name="tab.name" />
          </n-tabs>
        </n-form-item>

        <div v-if="selectedOption === 'chap1'">
          <n-form-item label="单个间隔">
            <n-select v-model:value="formValue.min"
                      label-field="label"
                      value-field="value"
                      :options="singleIntervalOptions"
                      style="width: 100px" />
            <n-input-number v-model:value="formValue.minCount"
                            :min="0" />
          </n-form-item>
        </div>
        <div v-if="selectedOption === 'chap2'">
          <n-grid x-gap="5"
                  :cols="2">
            <n-gi>
              <n-form-item label="单个间隔">
                <n-select v-model:value="formValue.min"
                          label-field="label"
                          value-field="value"
                          :options="singleIntervalOptions"
                          style="width: 100px" />
                <n-input-number v-model:value="formValue.minCount"
                                :min="0" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="循环间隔">
                <n-select v-model:value="formValue.hour"
                          label-field="label"
                          value-field="value"
                          :options="loopIntervalOptions"
                          style="width: 100px" />
                <n-input-number v-model:value="formValue.hourCount"
                                :min="0" />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-grid x-gap="5"
                  :cols="2">
            <n-gi>
              <n-form-item label="休息时间段">
                <n-time-picker v-model:value="formValue.startTime" />
                <n-time-picker v-model:value="formValue.endTime" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="停止日期">
                <n-date-picker v-model:value="formValue.endDate"
                               type="datetime"
                               clearable />
              </n-form-item>
            </n-gi>
          </n-grid>
        </div>
      </n-form>

      <template #footer>
        <div class="action-button-group">
          <n-button type="default"
                    @click="active = false">取消</n-button>
          <n-button type="primary"
                    @click="sendMsg">确定</n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped lang="less">
.action-button-group {
  display: flex;
  justify-content: flex-end; /* Right align the buttons */
  gap: 8px; /* Optional: Add spacing between buttons */

  > .n-button {
    border-radius: 6px;
  }
}
</style>
