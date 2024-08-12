<template>
  <n-modal v-model:show="showModal"
           preset="card"
           style="width: 550px; border-radius: 8px">
    <template #header> 编辑资料 </template>
    <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
              :default-file-list="fileList"
              list-type="image-card"
              style="display: flex; justify-content: center">
      点击上传
    </n-upload>

    <div style="margin-top: 30px">
      <n-form ref="formRef"
              :model="formValue"
              :rules="rules"
              require-mark-placement="left">
        <n-form-item path="sysAccountName">
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
                批量编辑时，会在您设置的用户名后添加编号后缀，例如：username_1、username_2
              </n-tooltip>
            </div>
          </template>
          <n-input v-model:value="formValue.sysAccountName"
                   placeholder="用户名为空，则会删除用户名"
                   clearable
                   style="width: 500px" />
        </n-form-item>
        <n-form-item label="姓氏"
                     path="sysAccountFirstName">
          <n-input v-model:value="formValue.sysAccountFirstName"
                   placeholder="请输入"
                   maxlength="64"
                   show-count
                   clearable
                   style="width: 500px" />
        </n-form-item>
        <n-form-item label="名字"
                     path="sysAccountLastName">
          <n-input v-model:value="formValue.sysAccountLastName"
                   placeholder="请输入"
                   maxlength="64"
                   show-count
                   clearable
                   style="width: 500px" />
        </n-form-item>
        <n-form-item label="个人简介"
                     path="code">
          <n-input v-model:value="formValue.sysAccountAbout"
                   type="textarea"
                   placeholder="请输入"
                   style="width: 500px"
                   maxlength="70"
                   show-count />
        </n-form-item>
      </n-form>
    </div>
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
import { QuestionCircleOutlined } from '@vicons/antd';
import { editAccountDetail } from '@/api/account';
import { useMessage } from 'naive-ui';

export interface editFormValue {
  sysAccountName: String;
  account: String;
  sysAccountLastName: String;
  sysAccountAbout: String;
}

const emit = defineEmits(['reloadTable']);

const message = useMessage();

let props = defineProps(['editShowFlag', 'editRowData']);

let showModal = ref<Boolean>(false);

const rules = {
  account: {
    required: true,
    message: '请输入电话号码',
    trigger: ['input'],
  },
};

let formValue = ref<editFormValue>({
  sysAccountName: '',
  sysAccountFirstName: '',
  sysAccountLastName: '',
  sysAccountAbout: '',
});

const confirmAction = async () => {
  let editParam = props.editRowData;
  editParam.sysAccountFirstName = formValue.value.sysAccountFirstName;
  editParam.sysAccountName = formValue.value.sysAccountName;
  editParam.sysAccountLastName = formValue.value.sysAccountLastName;
  editParam.sysAccountAbout = formValue.value.sysAccountAbout;

  await editAccountDetail(editParam).then((res) => {
    if (res.data.code === 200) {
      message.success('修改成功');
      showModal.value = false;
      emit('reloadTable');
    } else message.error('msg');
  });
};

watch(
  () => props.editShowFlag,
  () => {
    showModal.value = true;
    console.log(props.editRowData);
    formValue.value.sysAccountName = props.editRowData.sysAccountName;
    formValue.value.sysAccountFirstName = props.editRowData.sysAccountFirstName;
    formValue.value.sysAccountLastName = props.editRowData.sysAccountLastName;
    formValue.value.sysAccountAbout = props.editRowData.sysAccountAbout;
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
