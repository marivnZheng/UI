<template>
  <n-modal v-model:show="showModal"
           preset="card"
           :on-after-leave="modalLeave"
           style="width: 550px; border-radius: 8px">
    <template #header>
      <div style="width: 250px; border-radius: 6px">
        <n-tabs type="segment"
                animated
                size="small"
                :on-update-value="change">
          <n-tab v-for="(tab, index) in tabs"
                 :key="index"
                 :name="tab.name">
            <template #default>
              <n-icon>
                <component :is="tab.icon" />
              </n-icon>
              {{ tab.label }}
            </template>
          </n-tab>
        </n-tabs>
      </div>
    </template>

    <n-form ref="formRef"
            :model="formValue"
            :rules="rules"
            require-mark-placement="left">
      <n-form-item path="account">
        <template #label>
          账号
          <n-divider vertical />
          <span @click="handleSelectAll"
                style="color: #2080f0; cursor: pointer">全选</span>
        </template>
        <n-select v-model:value="formValue.account"
                  label-field="TgName"
                  value-field="sysAccountId"
                  multiple
                  :options="accountList"
                  clearable />
      </n-form-item>

      <n-form-item label="单个间隔">
        <n-select v-model:value="formValue.min"
                  label-field="label"
                  value-field="value"
                  :options="singleIntervalOptions"
                  style="width: 100px" />
        <n-input-number v-model:value="formValue.minCount"
                        :min="0" />
      </n-form-item>

      <div v-if="selectedOption === 'chap1'">
        <n-form-item label="用户名"
                     path="userNameAdd">
          <template #label>
            <div style="display: flex; align-items: center">
              用户名
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="18"
                          class="text-gray-400 cursor-pointer">
                    <QuestionCircleOutlined />
                  </n-icon>
                </template>
                自动过滤已添加，支持以下格式：<br />
                username<br />
                @username<br />
                https://t.me/username
              </n-tooltip>
            </div>
          </template>
          <n-input-group>
            <n-input v-model:value="formValue.userNameAdd"
                     type="textarea"
                     placeholder="请输入用户名，多个请用空格/逗号/换行分隔" />
          </n-input-group>
        </n-form-item>
      </div>
      <div v-if="selectedOption === 'chap2'">
        <n-form-item label="手机号"
                     path="username">
          <n-input-group>
            <n-input v-model:value="formValue.username"
                     type="textarea"
                     placeholder="请输入用户名，多个请用空格/逗号/换行分隔，Telegram官方服务号：42777" />
          </n-input-group>
        </n-form-item>
      </div>
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
import { onMounted, ref, watch } from 'vue';
import { PhoneOutlined, QrcodeOutlined, QuestionCircleOutlined } from '@vicons/antd';

import { useMessage } from 'naive-ui';
import { addConcatTg, addConcatTgPhone, listOnlineAccount } from '@/api/friend';
import { useFriendStore } from '@/store/modules/friend';

const selectedOption = ref('chap1'); // 选择的选项

let accountList = ref([]);

const emit = defineEmits(['reloadTable']);

const formRef = ref();

const message = useMessage();
const friendStore = useFriendStore();

let props = defineProps({ addShowFlag: Boolean });

let showModal = ref<Boolean>(false);

let codeBtnLoading = ref<Boolean>(false);

const singleIntervalOptions = [
  {
    label: '秒',
    value: '0',
  },
];

const tabs = ref([
  { name: 'chap1', icon: PhoneOutlined, label: '用户名' },
  { name: 'chap2', icon: QrcodeOutlined, label: '手机号' },
]);

const rules = {
  // account: {
  //   // required: true,
  //   message: '请选择账号',
  //   trigger: ['change'],
  // },
  usernameAdd: {
    required: true,
    message: '请输入',
    trigger: ['input'],
  },
};

let formValue = ref({
  account: [],
  min: '0',
  minCount: 6,
  userNameAdd: '',
});

function getAccountList() {
  listOnlineAccount({ pageNum: 1, pageSize: 10 }).then((response) => {
    response.data.rows.forEach((e) => {
      e.TgName = e.sysAccountFirstName
        ? e.sysAccountFirstName
        : '' + ' ' + e.sysAccountLastName
        ? e.sysAccountLastName
        : '';
    });
    accountList.value = response.data.rows;
    if (accountList.value.length > 0) {
      formValue.value.account.push(accountList.value[0].sysAccountId);
    }
  });
}

function handleSelectAll() {
  formValue.value.account = [];
  accountList.value.forEach((e) => {
    formValue.value.account.push(e.sysAccountId);
  });
}

function change(e) {
  selectedOption.value = e;
}

function modalLeave() {
  selectedOption.value = 'chap1';
  codeBtnLoading.value = false;
  formValue.value = {
    phone: null,
    code: null,
    codeHash: null,
  };
}

const confirmAction = async () => {
  let param = {
    sysAccountId: null,
    sysAccountIds: [],
    sysConcatsId: null,
    sysConcatsName: null,
    sysConcatsUserName: null,
    sysMutualContact: null,
    sysStatus: null,
    sysUserId: null,
    userNameAdd: formValue.value.userNameAdd,
    minCount: formValue.value.minCount,
    min: formValue.value.min,
  };

  accountList.value.forEach((e) => {
    if (formValue.value.account == e.sysAccountId)
      param.sysAccountIds.push(e.sysAccountStringSession);
  });
  formRef.value.validate(async (errors) => {
    console.log(errors);
    if (!errors) {
      if (selectedOption.value === 'chap1')
        await addConcatTg(param).then((res) => {
          if (res.data.code === 200) {
            message.success('添加成功');
            showModal.value = false; // 关闭Modal
            emit('reloadTable');
          } else message.error(res.data.msg);
        });
      else if (selectedOption.value === 'chap2') {
        await addConcatTgPhone(param).then((res) => {
          if (res.data.code === 200) {
            message.success('已成功登录账号');
            showModal.value = false; // 关闭Modal
            emit('reloadTable');
          } else message.error(res.data.msg);
        });
      }
    }
  });
};

onMounted(getAccountList);

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
