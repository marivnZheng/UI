<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFriendStore } from '@/store/modules/friend';
import { inviteGroup, listGroup } from '@/api/friend';
import { useMessage } from 'naive-ui';
import { useGroupStore } from '@/store/modules/group';

let props = defineProps({ inviteShowFlag: Number });
const friendStore = useFriendStore();
const groupStore = useGroupStore();
const message = useMessage();

let showModal = ref<Boolean>(false);

let loading = ref(false);
let options = ref([]);
let selectedValue = ref();

async function loadOptions() {
  loading.value = true;

  friendStore.accountList.forEach((e) => {
    if (friendStore.currentSysAccountId === e.sysAccountId)
      groupStore.filterParam.sysAccountStringSession = e.sysAccountStringSession;
  });

  await listGroup({ page: 1, pageSize: 100000 }, groupStore.filterParam).then((res) => {
    options.value = res.data.rows;
    loading.value = false;
  });
}

async function confirmAction() {
  {
    let param = {
      groupId: selectedValue.value,
      concatsList: null,
      sysAccountId: friendStore.currentSysAccountId,
      min: 0,
      minCount: 6,
    };

    options.value.forEach((item) => {
      if (item.sysGroupId === selectedValue.value) param.concatsList = item;
    });
    await inviteGroup(param).then(() => {
      message.success('邀请成功');
      showModal.value = false;
    });
  }
}

watch(
  () => props.inviteShowFlag,
  () => {
    showModal.value = true;
  }
);
</script>

<template>
  <n-modal v-model:show="showModal"
           preset="card"
           title="邀请进群"
           style="width: 550px; border-radius: 8px">
    群组
    <n-select v-model:value="selectedValue"
              placeholder="请选择"
              :options="options"
              :loading="loading"
              label-field="sysGroupTitle"
              value-field="sysGroupId"
              clearable
              @focus="loadOptions" />
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
