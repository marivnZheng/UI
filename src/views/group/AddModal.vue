<template>
  <n-modal v-model:show="showModal"
           preset="card"
           :on-after-leave="modalLeave"
           style="width: 550px; border-radius: 8px"
           title="添加群组">
    <n-form ref="formRef"
            :model="formValue"
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

      <n-grid x-gap="5"
              :cols="2">
        <n-form-item-gi label="单个间隔">
          <n-select v-model:value="formValue.onceType"
                    label-field="label"
                    value-field="value"
                    :options="singleIntervalOptions"
                    disabled
                    style="width: 100px" />
          <n-input-number v-model:value="formValue.onceTime"
                          :min="0" />
        </n-form-item-gi>

        <n-form-item-gi label="循环间隔">
          <n-select v-model:value="formValue.loopType"
                    label-field="label"
                    value-field="value"
                    :options="loopIntervalOptions"
                    disabled
                    style="width: 100px" />
          <n-input-number v-model:value="formValue.loopTime"
                          :min="0" />
        </n-form-item-gi>
      </n-grid>

      <n-form-item path="sendMethod">
        <template #label>
          <div style="display: flex; align-items: center">
            分配方式
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="18"
                        class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              选中全部，所有选中账号都将添加全部群组，选中平分，选中账号将平分需添加的群组
            </n-tooltip>
          </div>
        </template>
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
      <n-form-item label="群组链接"
                   path="groupLink">
        <n-input v-model:value="formValue.groupLink"
                 type="textarea"
                 placeholder="多个链接请用逗号分隔" />
      </n-form-item>
    </n-form>

    <template #action>
      <div class="action-button-group">
        <n-button type="default"
                  @click="showModal = false">取消</n-button>
        <n-button type="primary"
                  @click="confirmAction">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { useFriendStore } from '@/store/modules/friend';
import { inviteGroupList } from '@/api/group';
import { QuestionCircleOutlined } from '@vicons/antd';

const friendStore = useFriendStore();
const message = useMessage();

let props = defineProps({ addShowFlag: Boolean });
const emit = defineEmits(['reloadTable']);

let showModal = ref<Boolean>(false);

let accountLoading = ref(false);
let accountList = ref<Array<any>>([]);

let objectSelect = ref<String>('account');
const objectOptions = [
  {
    label: '账号',
    value: 'account',
  },
];

const tabs = ref([
  { name: 'chap1', label: '全部' },
  { name: 'chap2', label: '平分' },
]);

const singleIntervalOptions = [
  {
    label: '分',
    value: '1',
  },
];

const loopIntervalOptions = [
  {
    label: '分',
    value: '0',
  },
];

let formValue = ref({
  accountList: [],
  onceType: '1',
  onceTime: 6,
  addMethod: '1',
  loopType: '0',
  loopTime: 10,
  groupLink: '',
});

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
  formValue.value.addMethod = e == 'chap1' ? '1' : '2';
}

async function confirmAction() {
  let accountList = [];
  formValue.value.accountList.forEach((selectedAccountId) => {
    accountList.push(
      friendStore.accountList.filter((item) => item.sysAccountId == selectedAccountId)[0]
        .sysAccountStringSession
    );
  });

  formValue.value.accountList = accountList;

  let param = {
    accountList: [],
    onceTime: '',
    loopTime: '',
    groupLink: '',
    addMethod: formValue.value.addMethod,
  };

  param.accountList = formValue.value.accountList;
  param.onceTime = formValue.value.onceTime.toString();
  param.loopTime = formValue.value.loopTime.toString();
  param.groupLink = formValue.value.groupLink;

  inviteGroupList(param).then((res) => {
    if (res.data.code == 200) {
      message.success('操作成功');
      showModal.value = false;
      emit('reloadTable');
    } else message.error(res.data.msg);
  });
}

function modalLeave() {
  formValue.value = {
    accountList: [],
    onceType: '1',
    onceTime: 6,
    addMethod: '1',
    loopType: '0',
    loopTime: 10,
    groupLink: '',
  };
}

watch(
  () => props.addShowFlag,
  () => {
    showModal.value = true;
  }
);
</script>

<style lang="less" scoped>
.n-tabs.is-hover {
  font-weight: bold;
}

.action-button-group {
  display: flex;
  justify-content: flex-end; /* Right align the buttons */
  gap: 8px; /* Optional: Add spacing between buttons */

  > .n-button {
    border-radius: 6px;
  }
}
</style>
