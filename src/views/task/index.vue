<template>
  <div>
    <n-card :bordered="false"
            class="proCard">
      <BasicTable :columns="columns"
                  :request="getList"
                  ref="actionRef"
                  :row-key="(row) => row"
                  :actionColumn="actionColumn"
                  :checked-row-keys="checkedRowKeys"
                  @update:checked-row-keys="onCheckedRow"
                  @update:sorter="handleSorterChange"
                  @update:filters="handleFiltersChange"
                  :scroll-x="1500">
        <template #tableTitle>
          <div class="button-group">
            <n-button type="primary"
                      @click="messageShowFlag += 1">
              <template #icon>
                <n-icon>
                  <Add />
                </n-icon>
              </template>
              批量发送
            </n-button>
            
            <n-button type="primary"
                      @click="messagPrivateAndForwardShowFlag += 1">
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              批量转发私聊
            </n-button>
            <n-button type="primary"
                      @click="messagePrivateShowFlag += 1">
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              批量私聊
            </n-button>
            <n-button type="primary"
                      @click="messageForwordFlag+=1">
              <template #icon>
                <n-icon>
                  <ArrowForward />
                </n-icon>
              </template>
              批量转发
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length === 0"
                      @click="updateTask(null, 3)"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <Reload />
                </n-icon>
              </template>
              启动
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length == 0"
                      @click="updateTask(null, 2)"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <PlayCircleOutline />
                </n-icon>
              </template>
              暂停
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="error"
                      :disabled="checkedRowKeys.length == 0"
                      @click="deleteTask"
                      class="button-with-badge"
                      dashed>
              <template #icon>
                <n-icon>
                  <PauseCircleOutline />
                </n-icon>
              </template>
              删除
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
          </div>
        </template>

        <!-- <template #toolbar>
          <n-button type="primary"
                    @click="reloadTable"
                    style="border-radius: 8px">刷新数据</n-button>
        </template> -->
      </BasicTable>
    </n-card>

    <basicModal @register="modalRegister"
                ref="modalRef"
                class="basicModal"
                @on-ok="okModal">
      是否确认删除？
    </basicModal>

    <SendMessage @reload-table="reloadTable"
                 :messageShowFlag />
    <!-- <SendMessagePrivateAndForward @reload-table="reloadTable"
                 :messagPrivateAndForwardShowFlag /> -->
    <SendMessagePrivate @reload-table="reloadTable"
                        :messagePrivateShowFlag />

    <SendMessageForward @reload-table="reloadTable"
                        :messageForwordFlag />
    <TaskDetail :taskDetailShowFlag
                :taskDetailRecord />
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref, watch } from 'vue';
import { BasicTable, TableAction } from '@/components/Table';
import { basicModal, useModal } from '@/components/Modal';
import { columns } from './columns';
import { DataTableRowKey, useMessage } from 'naive-ui';
import {
  Add,
  PauseCircleOutline,
  Pencil,
  PlayCircleOutline,
  Reload,
  ArrowForward,
} from '@vicons/ionicons5';

import { deleteTaskList, listTask, resend, UserInfor } from '@/api/task';
import SendMessage from './SendMessage.vue';
import SendMessagePrivate from './SendMessagePrivate.vue';
// import SendMessagePrivateAndForward from './SendMessagePrivateAndForward.vue';
import SendMessageForward from './SendMessageForward.vue';
import { useFriendStore } from '@/store/modules/friend';
import TaskDetail from '@/views/task/TaskDetail.vue';
import { useTaskStore } from '@/store/modules/task';
import { json } from 'stream/consumers';
import { Console } from 'console';

const friendStore = useFriendStore();
const message = useMessage();
const actionRef = ref();
const [modalRegister, { openModal, closeModal }] = useModal({
  title: '系统提示',
});

const taskStore = useTaskStore();

let checkedRowKeys = ref<DataTableRowKey[]>([]);

let messageShowFlag = ref<Number>(0);
let messagePrivateShowFlag = ref<Number>(0);
let messagPrivateAndForwardShowFlag = ref<Number>(0)
let messageForwordFlag = ref<Number>(0);
let taskDetailShowFlag = ref<Number>(0);
let taskDetailRecord = ref();

const actionColumn = reactive({
  width: 70,
  title() {
    return h('span', { style: { fontWeight: 'bold' } }, { default: () => '操作' });
  },
  key: 'action',
  fixed: 'right',
  render(record) {
    let actions = [
      {
        label: '启动',
        onClick: updateTask.bind(null, record, 3),
      },
      {
        label: '详情',
        onClick: handleTaskDetail.bind(null, record),
      },
    ];

    if (record.jobStatus == 3 && record.jobType != 2)
      actions[0] = {
        label: '再发',
        onClick: updateTask.bind(null, record, 1),
      };
    else if (record.jobStatus != 0)
      actions[0] = {
        label: '暂停',
        onClick: updateTask.bind(null, record, 2),
      };

    return h(TableAction as any, {
      style: 'text',
      actions: actions,
      select: (key) => {
        window['$message'].info(`您点击了，${key} 按钮`);
      },
    });
  },
});

let sortParam = {
  column: null,
  sortOrder: null,
};

async function getList(pageParams) {
  let queryParams = {
    pageNum: pageParams.pageNum,
    pageSize: pageParams.pageSize,
    orderByColumn: sortParam.column,
    isAsc: sortParam.sortOrder,
  };
  return await listTask(queryParams, taskStore.filterParam).then((response) => {
    let data = response.data;
    data.rows.forEach((item) => {
      if (item.jobType == '2') {
        switch (item.intervalLoopUnit) {
          case 0:
            item.intervalLoop = item.intervalLoop + '秒';
            break;
          case 1:
            item.intervalLoop = item.intervalLoop + '分';
            break;
          case 2:
            item.intervalLoop = item.intervalLoop + '小时';
            break;
        }
        switch (item.intervalsUnit) {
          case 0:
            item.intervals = item.intervals + '秒';
            break;
          case 1:
            item.intervals = item.intervals + '分';
            break;
          case 2:
            item.intervals = item.intervals + '小时';
            break;
        }
      } else {
        switch (item.intervalsUnit) {
          case 0:
            item.intervals = item.intervals + '秒';
            break;
          case 1:
            item.intervals = item.intervals + '分';
            break;
          case 2:
            item.intervals = item.intervals + '小时';
            break;
        }
      }
    });
    return {
      ...queryParams,
      pageCount: Math.ceil(data.total / queryParams.pageSize),
      itemCount: data.total,
      list: data.rows,
    };
  });
}

function handleSorterChange(sorter) {
  if (sorter) {
    console.log(sorter);
    columns.forEach((item) => {
      if (item.key == sorter.columnKey && item.sorter) {
        sortParam.column = sorter.order == false ? null : sorter.columnKey;
        sortParam.sortOrder =
          sorter.order == false ? null : sorter.order == 'descend' ? 'desc' : 'asc';
      }
    });

    reloadTable();
  }
}

function handleFiltersChange(filters) {
  taskStore.filterParam = filters;
  reloadTable();
}

function onCheckedRow(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys;
}

async function updateTask(record, option) {
  let param = [];
  console.log(record);
  if (record) param.push(record);
  else param = checkedRowKeys.value;

  param.forEach((item) => (item.option = option));
  const transformedArray = param.map((item) => {
    return { ...item };
  });
  transformedArray.map((item) => {
    switch (item.intervalsUnit) {
      case 0:
        item.intervals = item.intervals.replace(new RegExp('秒', 'g'), ''); // 使用正则表达式全局替换
        break;
      case 1:
        item.intervals = item.intervals.replace(new RegExp('分', 'g'), ''); // 使用正则表达式全局替换
        break;
      case 2:
        item.intervals = item.intervals.replace(new RegExp('小时', 'g'), ''); // 使用正则表达式全局替换
        break;
    }
    if (item.intervalLoop != null) {
      switch (item.intervalLoopUnit) {
        case 0:
          item.intervalLoop = item.intervalLoop.replace(new RegExp('秒', 'g'), ''); // 使用正则表达式全局替换
          break;
        case 1:
          item.intervalLoop = item.intervalLoop.replace(new RegExp('分', 'g'), ''); // 使用正则表达式全局替换
          break;
        case 2:
          item.intervalLoop = item.intervalLoop.replace(new RegExp('小时', 'g'), ''); // 使用正则表达式全局替换
          break;
      }
    } else {
      item.intervalLoop = null;
    }
    delete item.parms;
    return item;
  });

  //   let formparms = JSON.parse(transformedArray[0].parms);//获取转义后的JSON数据
  // let Onmsg = formparms.message.replace(/"/g, '\\"');//替换引号格式
  // let Inmsg =  formparms.messageGroup[0].message.replace(/"/g, '\\"');//替换引号格式
  // let conOn = Onmsg.replace(/"/g,"");//去除引号
  // let conIn = Inmsg.replace(/"/g,"");//去除引号
  // formparms.message=conOn;//赋值
  // formparms.messageGroup[0].message = conIn;//赋值

  // transformedArray[0].parms = JSON.stringify(formparms); //转义赋值
  await resend(transformedArray).then((res) => {
    if (res.data.code == '200') {
      switch (option) {
        case 3:
          message.success('开始任务操作成功');
          break;
        case 2:
          message.success('暂停任务操作成功');
          break;
        case 1:
          message.success('重新发送成功操作成功');
          break;
      }
      reloadTable();
    } else message.error(res.data.msg);
  });
}

function handleTaskDetail(record) {
  taskDetailShowFlag.value += 1;
  taskDetailRecord.value = record;
}

function deleteTask() {
  openModal();
}

async function okModal() {
  let param = [];
  checkedRowKeys.value.forEach((item) => param.push(item.jobId));
  await deleteTaskList(param).then(async (res) => {
    if (res.data.code == 200) {
      message.success('删除成功');
      closeModal();
      reloadTable();
    }
  });
}

function reloadTable() {
  actionRef.value.reload();
  checkedRowKeys.value = [];
}

watch(
  () => friendStore.currentSysAccountId,
  () => reloadTable()
);

watch(
  () => taskStore.reloadTableFlag,
  (newValue) => {
    if (newValue) {
      reloadTable();
      taskStore.reloadTableFlag = false;
    }
  }
);
</script>

<style lang="less" scoped>
.button-group {
  // 设置按钮之间的间距
  > .n-button {
    border-radius: 8px;
    margin-right: 10px; // 右侧间距
    &:last-child {
      margin-right: 0; // 最后一个按钮没有右侧间距
    }
  }
}

.button-with-badge {
  position: relative;
  display: inline-flex;
  align-items: center;

  .badge {
    position: absolute;
    top: -5px;
    right: -7px;
    border-color: white;
    border-width: 1px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 5px;
    font-size: 12px;
    z-index: 1;
    pointer-events: none;
  }
}
</style>
