<script setup lang="ts">
import {ref, watch} from 'vue';
import {useFriendStore} from '@/store/modules/friend';
import {listGroup} from '@/api/friend';

let props = defineProps({ inviteShowFlag: Number });
  const friendStore = useFriendStore();

  let showModal = ref<Boolean>(false);

  let loading = ref(false);
  let options = ref([]);
  let value = ref();

  async function handleSearch(query: String = '') {
    loading.value = true;
    if (query.length === 0) {
      let param = {
        page: 1,
        pageSize: 1000,
        sysAccountId: friendStore.currentSysAccountId,
        sysAccountStringSession: '',
      };

      friendStore.accountList.forEach((e) => {
        if (friendStore.currentSysAccountId === e.sysAccountId)
          param.sysAccountStringSession = e.sysAccountStringSession;
      });

      await listGroup(param).then((res) => {
        options.value = res.data.row;
        loading.value = false;
      });
      return;
    } else {
      options.value = options.value.filter((item) => ~item.sysGroupTitle.indexOf(query));
      loading.value = false;
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
  <n-modal
    v-model:show="showModal"
    preset="card"
    :on-after-leave="modalLeave"
    title="邀请进群"
    style="width: 550px; border-radius: 8px"
  >
    群组
    <n-select
      v-model:value="value"
      filterable
      placeholder="请选择"
      :options="options"
      :loading="loading"
      label-field="sysGroupTitle"
      clearable
      remote
      @search="handleSearch"
    />
    <template #action>
      <div class="action-button-group">
        <n-button type="default" @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="confirmAction">确定</n-button>
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
