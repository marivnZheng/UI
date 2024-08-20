<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFriendStore } from '@/store/modules/friend';
import { useMessage } from 'naive-ui';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import { Add } from '@vicons/ionicons5';
import moment from 'moment-timezone';
import { sendMessage, UserInfor } from '@/api/task';
import { userInfo } from 'os';

let props = defineProps({ messageForwordFlag: Number, sysConcatsList: Array<String> });
const friendStore = useFriendStore();
const message = useMessage();
const emit = defineEmits(['reloadTable']);

let active = ref<Boolean>(false);

let headers = ref({
  Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
});

let accountLoading = ref(false);

let confirmBtnLoading = ref<Boolean>(false);

let formValue = ref({
  accountList: [],
  targActive: '2',
  accountLoopType: '1',
  accountLoop: 2,
  messageGroup: [
    {
      fileList: [],
      fileName: '',
      message: '',
    },
  ],
  sendMethod: '1',
  onceType: '1',
  onceMin: 6,
  loopType: '1',
  loopMin: 10,
  startTime: undefined,
  endTime: undefined,
  endDate: undefined,
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

let objectSelect = ref<String>('account');
const objectOptions = [
  {
    label: '账号',
    value: 'account',
  },
];

let accountList = ref<Array<any>>([]);

const targetTabs = ref([
  { name: '1', label: '用户' },
  { name: '2', label: '群组' },
]);

const accountIntervalOptions = [
  {
    label: '分',
    value: '1',
  },
];

const selectedOption = ref<String>('1');
const tabs = ref([
  { name: '1', label: '单次发送' },
  { name: '2', label: '循环发送' },
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

async function loadAccountOptions() {
  accountLoading.value = true;

  accountList.value = friendStore.accountList;
  accountLoading.value = false;
}

async function handleSelectAll() {
  await loadAccountOptions();
  formValue.value.accountList = [];
  friendStore.accountList.forEach((item) => formValue.value.accountList.push(item.sysAccountId));
}

function changeTargetTab(e) {
  formValue.value.targActive = e;
}

function changeTab(e) {
  selectedOption.value = e;
  formValue.value.sendMethod = e;
}

async function sendMsg() {
  confirmBtnLoading.value = true;

  let accountList = [];
  formValue.value.accountList.forEach((selectedAccountId) => {
    accountList.push(
      friendStore.accountList.filter((item) => item.sysAccountId == selectedAccountId)[0]
    );
  });

  formValue.value.accountList = accountList;
  formValue.value.startTime =
    formValue.value.startTime == undefined
      ? ''
      : moment.utc(formValue.value.startTime).toISOString();
  formValue.value.endTime =
    formValue.value.endTime == undefined ? '' : moment.utc(formValue.value.endTime).toISOString();
  formValue.value.endDate =
    formValue.value.endDate == undefined ? '' : moment.utc(formValue.value.endDate).toISOString();

  if (selectedOption.value == '1') {
    delete formValue.value.hourCount;
    delete formValue.value.hour;
  }
  await sendMessage(formValue.value).then((res) => {
    if (res.data.code == 200) {
      confirmBtnLoading.value = false;
      message.success('成功添加任务');
      active.value = false;
      emit('reloadTable');

      formValue.value = {
        accountList: [],
        targActive: '2',
        accountLoopType: '1',
        accountLoop: 2,
        messageGroup: [
          {
            fileList: [],
            fileName: '',
            message: '',
          },
        ],
        sendMethod: '1',
        onceType: '1',
        onceMin: 6,
        loopType: '1',
        loopMin: 10,
        startTime: undefined,
        endTime: undefined,
        endDate: undefined,
      };
    } else message.error(res.data.msg);
  });
}
watch(
  () => props.messageForwordFlag,
  () => {
    UserInfor().then((res) => {
      console.log(res.data.code, res.data.code == 200, res.data.data.isVip, 'res.code');
      if (res.data.code === 200) {
        if (res.data.data.isVip) {
          active.value = true;
        } else {
          message.warning('需要成为会员才能转发');
        }
      }
    });
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
                          path="account">
            <n-select v-model:value="formValue.accountList"
                      label-field="sysAccountFirstName"
                      value-field="sysAccountId"
                      multiple
                      :options="accountList"
                      :loading="accountLoading"
                      @focus="loadAccountOptions"
                      :max-tag-count="1"
                      clearable />
          </n-form-item-gi>
        </n-grid>
        <n-grid x-gap="10"
                :cols="2">
          <n-form-item-gi label="消息链接">
            <n-input v-model:value="formValue.forWordMessage"
                     placeholder="转发链接"
                     clearable
                     style="width: 500px" />
          </n-form-item-gi>
        </n-grid>

        <n-grid x-gap="10"
                :cols="2">
          <n-form-item-gi label="发送目标">
            <n-tabs type="segment"
                    animated
                    default-value="2"
                    size="small"
                    :on-update-value="changeTargetTab">
              <n-tab v-for="(tab, index) in targetTabs"
                     :label="tab.label"
                     :key="index"
                     :name="tab.name" />
            </n-tabs>
          </n-form-item-gi>
          <n-form-item-gi label="账号间隔">
            <n-select v-model:value="formValue.accountLoopType"
                      label-field="label"
                      value-field="value"
                      disabled
                      :options="accountIntervalOptions"
                      style="width: 100px" />
            <n-input-number v-model:value="formValue.accountLoop"
                            :min="0" />
          </n-form-item-gi>
        </n-grid>

        <!--        <n-form-item label="定时过滤群组">-->
        <!--          <n-tabs type="segment" animated size="small" :on-update-value="changeTab">-->
        <!--            <n-tab v-for="(tab, index) in tabs" :label="tab.label" :key="index" :name="tab.name" />-->
        <!--          </n-tabs>-->
        <!--        </n-form-item>-->

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

        <div v-if="selectedOption === '1'">
          <n-form-item label="单个间隔">
            <n-select v-model:value="formValue.onceType"
                      label-field="label"
                      value-field="value"
                      :options="singleIntervalOptions"
                      style="width: 100px" />
            <n-input-number v-model:value="formValue.onceMin"
                            :min="0" />
          </n-form-item>
        </div>
        <div v-if="selectedOption === '2'">
          <n-grid x-gap="5"
                  :cols="2">
            <n-gi>
              <n-form-item label="单个间隔">
                <n-select v-model:value="formValue.onceType"
                          label-field="label"
                          value-field="value"
                          :options="singleIntervalOptions"
                          style="width: 100px" />
                <n-input-number v-model:value="formValue.onceMin"
                                :min="0" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="循环间隔">
                <n-select v-model:value="formValue.loopType"
                          label-field="label"
                          value-field="value"
                          :options="loopIntervalOptions"
                          style="width: 100px" />
                <n-input-number v-model:value="formValue.loopMin"
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
