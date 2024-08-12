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
    <n-card size="small"
            style="
        border-radius: 10px;
        background: #fffbe6;
        border-color: #ffe58f;
        margin-bottom: 25px;
        width: 500px;
      ">
      温馨提醒：登入设备超过24小时后进行操作避免封号引起官方风控，如有重要联系人，登录后请先导出好友列表，以免封号丢失
    </n-card>
    <div v-if="selectedOption === 'chap1'">
      <n-form ref="formRef"
              :model="formValue"
              :rules="rules"
              require-mark-placement="left">
        <n-form-item label="手机号码"
                     path="phone">
          <n-input v-model:value="formValue.phone"
                   placeholder="区号+手机号，例：8613812345678"
                   :allow-input="onlyAllowNumber"
                   :show-button="false"
                   style="width: 500px" />
        </n-form-item>
        <n-form-item label="验证码"
                     path="code">
          <n-input-group>
            <n-input v-model:value="formValue.code"
                     placeholder="请输入"
                     style="width: 445px" />
            <n-button :loading="codeBtnLoading"
                      @click="handleValidateClick"> 发送验证码 </n-button>
          </n-input-group>
        </n-form-item>

        <n-form-item label="账号二次认证密码"
                     path="password"
                     v-if="needPassword">
          <n-input-group>
            <n-input type="password"
                     show-password-on="click"
                     v-model:value="formValue.password"
                     placeholder="请输入"
                     style="width: 500px" />
          </n-input-group>
        </n-form-item>
      </n-form>
    </div>
    <div v-if="selectedOption === 'chap3'">
      <n-upload multiple
                directory-dnd
                action="/backApi/system/account/sessionFileUpload"
                :max="5"
                accept=".session,"
                :headers="headers"
                :on-before-upload="beforeUpload"
                v-modal:file-list="sessionFileList"
                @change="handleUploadChange">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48"
                    :depth="3">
              <ArchiveOutline />
            </n-icon>
          </div>
          <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
          <n-p depth="3"
               style="margin: 8px 0 0 0">
            请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </div>
    <template #action>
      <div class="action-button-group">
        <n-button type="default"
                  @click="showModal = false">取消</n-button>
        <n-button type="primary"
                  :loading="confirmBtnLoading"
                  @click="confirmAction">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FileAddOutlined, PhoneOutlined, QrcodeOutlined } from '@vicons/antd';
import { ArchiveOutline } from '@vicons/ionicons5';
import { UploadFileInfo, useMessage } from 'naive-ui';
import {
  loginAccountByPhoneCode,
  sendPhoneCode,
  sessionFileLogin,
  checkPhoneAndUserJurisdiction,
} from '@/api/account';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import { useFriendStore } from '@/store/modules/friend';

const selectedOption = ref('chap1'); // 选择的选项

const emit = defineEmits(['reloadTable']);

const formRef = ref();

const message = useMessage();
const friendStore = useFriendStore();

let props = defineProps({ addShowFlag: Boolean });

let showModal = ref<Boolean>(false);

let codeBtnLoading = ref<Boolean>(false);
let confirmBtnLoading = ref<Boolean>(false);

let sessionFileList = ref<Array<UploadFileInfo>>([]);

let needPassword = ref<Boolean>(false);

let headers = ref({
  Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
});

const tabs = ref([
  { name: 'chap1', icon: PhoneOutlined, label: '手机号' },
  { name: 'chap2', icon: QrcodeOutlined, label: '二维码' },
  { name: 'chap3', icon: FileAddOutlined, label: '协议号' },
]);

const rules = {
  phone: {
    required: true,
    message: '请输入电话号码',
    trigger: ['input'],
  },
  code: {
    required: true,
    message: '请输入验证码',
    trigger: ['input'],
  },
};

let formValue = ref({
  phone: null,
  code: null,
  codeHash: null,
  password: null,
});

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
    password: null,
  };
}

function onlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value);
}

function handleValidateClick() {
  formRef.value.validate(async (errors) => {
    if (errors.find((e) => e[0].field === 'phone')) {
      message.error('请输入手机号码');
      return;
    } else {
      codeBtnLoading.value = true;
      await checkPhoneAndUserJurisdiction(formValue.value.phone).then((res) => {
        if (res.data.code == 200) {
          sendPhoneCode(formValue.value.phone).then((res) => {
            message.success('已发送验证码');
            console.log(res, res.data.codeHash, res.data.data.codeHash, '123123');
            codeBtnLoading.value = false;
            formValue.value.codeHash = res.data.data.codeHash;
            console.log(formValue, 'formValue');
          });
        } else {
          codeBtnLoading.value = false;
          message.error(res.data.msg);
        }
      });
    }
  });
}

function beforeUpload(file) {
  console.log(file);
  let fileExtName = file.file.name.split('.');
  if (fileExtName[1] != 'session') {
    message.warning('请选择session文件');
    return false;
  }
}

function handleUploadChange(data: { fileList: UploadFileInfo[] }) {
  sessionFileList.value = data.fileList;
}

const confirmAction = async () => {
  if (selectedOption.value === 'chap1') {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        confirmBtnLoading.value = true;

        let param = {
          codeHash: formValue.value.codeHash,
          codeNumber: formValue.value.code,
          phoneNumber: formValue.value.phone,
        };
        if (formValue.value.password) param.password = formValue.value.password;

        await loginAccountByPhoneCode(param).then((res) => {
          if (res.data.code === 200) {
            friendStore.getAccountList();
            confirmBtnLoading.value = false;
            message.success('新增账号成功');
            showModal.value = false; // 关闭Modal
            emit('reloadTable');
          } else if (res.data.code == 400) {
            message.warning('需要二次验证密码');
            needPassword.value = true;
            confirmBtnLoading.value = false;
          } else message.error(res.data.msg);
        });
      }
    });
  } else if (selectedOption.value === 'chap3') {
    let fileParam: String[] = [];
    sessionFileList.value.forEach((e) => {
      fileParam.push({ fileName: e.file.name });
    });
    await sessionFileLogin(fileParam).then((res) => {
      if (res.data.code === 200) {
        confirmBtnLoading.value = false;
        message.success('已成功登录账号');
        showModal.value = false; // 关闭Modal
        emit('reloadTable');
      } else message.error(res.data.msg);
    });
  }
};

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
