<script setup lang="ts">
import { ref, watch } from 'vue';
import { taskDetailColumns } from './taskDetailColumns';
import { getJobDetail } from '@/api/task';
import { useMessage } from 'naive-ui';
import { useTaskStore } from '@/store/modules/task';

let props = defineProps({ taskDetailShowFlag: Boolean, taskDetailRecord: {} });

const taskStore = useTaskStore();

const message = useMessage();

let showModal = ref<Boolean>(false);

let loading = ref<Boolean>(true);

let data = ref<Array<any>>([]);

async function getData(param? = props.taskDetailRecord) {
  delete param.parms;
  loading.value = true;
  await getJobDetail(param).then((res) => {
    data.value = res.data;
    loading.value = false;
  });
}

function handleFiltersChange(filters) {
  taskStore.taskDetailFilterParam = filters;
  getData();
}

watch(
  () => props.taskDetailShowFlag,
  () => {
    showModal.value = true;
  }
);

watch(
  () => props.taskDetailRecord,
  (newValue) => {
    getData(newValue);
  }
);
</script>

<template>
  <n-modal v-model:show="showModal"
           preset="card"
           style="width: auto; border-radius: 8px">
    <n-data-table :columns="taskDetailColumns"
                  :data="data"
                  :loading
                  :bordered="false"
                  @update:filters="handleFiltersChange" />
  </n-modal>
</template>

<style scoped lang="less"></style>
