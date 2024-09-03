<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFriendStore } from '@/store/modules/friend';
import { useMessage } from 'naive-ui';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import { Add } from '@vicons/ionicons5';
import { sendMessagePrivate } from '@/api/task';

let props = defineProps({ messagPrivateAndForwardShowFlag: Number });
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
  targetString: '',
  messageGroup: [
    {
      fileList: [],
      fileName: '',
      message: '',
    },
  ],
  onceType: '1',
  onceMin: 6,
  selectOption: '0',
  shareType: 1,
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

const selectedOption = ref<String>('1');
const tabs = ref([
  { name: '1', label: '全部' },
  { name: '2', label: '平分' },
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

function changeTab(e) {
  selectedOption.value = e;
  formValue.value.shareType = e;
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

  formValue.value.messageGroup.forEach((item) => {
    if (item.fileList[0]) {
      item.fileName = item.fileList[0].name;
    }
  });
  if (selectedOption.value == '1') {
    delete formValue.value.hourCount;
    delete formValue.value.hour;
  }
  await sendMessagePrivate(formValue.value).then((res) => {
    if (res.data.code == 200) {
      confirmBtnLoading.value = false;
      message.success('成功添加任务');
      active.value = false;
      emit('reloadTable');

      formValue.value = {
        accountList: [],
        targetString: '',
        messageGroup: [
          {
            fileList: [],
            fileName: '',
            message: '',
          },
        ],
        onceType: '1',
        onceMin: 6,
        selectOption: '0',
        shareType: 1,
      };
    } else message.error(res.data.msg);
  });
}

watch(
  () => props.messagPrivateAndForwardShowFlag,
  () => {
    active.value = true;
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

        <n-form-item label="用户名"
                     path="targetString">
          <n-input v-model:value="formValue.targetString"
                   type="textarea"
                   placeholder="请输入用户名，多个请用空格/逗号/换行分隔" />
        </n-form-item>

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
            <n-gi>
              <n-form-item label="开始时间">
                <n-date-picker v-model:value="formValue.nextPlanDate"
                               type="datetime"
                               clearable />
              </n-form-item>
            </n-gi>
          </n-grid>

        <n-form-item label="分配方式"
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

        <n-form-item label="单个间隔">
          <n-select v-model:value="formValue.onceType"
                    label-field="label"
                    value-field="value"
                    :options="singleIntervalOptions"
                    style="width: 100px" />
          <n-input-number v-model:value="formValue.onceMin"
                          :min="0" />
        </n-form-item>
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
