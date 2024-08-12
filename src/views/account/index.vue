<template>
  <div>
    <n-card :bordered="false"
            class="proCard">
      <BasicTable :columns="columns"
                  :request="getList"
                  :row-key="(row) => row"
                  ref="actionRef"
                  :actionColumn="actionColumn"
                  :checked-row-keys="checkedRowKeys"
                  @update:checked-row-keys="onCheckedRow"
                  @update:sorter="handleSorterChange"
                  @update:filters="handleFiltersChange"
                  :scroll-x="1500">
        <template #tableTitle>
          <div class="button-group">
            <n-button type="primary"
                      @click="addShowFlag += 1">
              <template #icon>
                <n-icon>
                  <Add />
                </n-icon>
              </template>
              新增
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length != 1"
                      @click="clickEditBtn">
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              编辑
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length != 1"
                      @click="syncAccounts">
              <template #icon>
                <n-icon>
                  <Reload />
                </n-icon>
              </template>
              同步信息
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length == 0"
                      @click="changAccountOnline(true)"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <PlayCircleOutline />
                </n-icon>
              </template>
              批量上线
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length == 0"
                      @click="changAccountOnline(false)"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <PauseCircleOutline />
                </n-icon>
              </template>
              批量下线
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="error"
                      :disabled="checkedRowKeys.length != 1"
                      @click="handleDelete"
                      dashed>
              <template #icon>
                <n-icon>
                  <TrashOutline />
                </n-icon>
              </template>
              删除
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
      是否确认删除编号为{{ delSysAccountIds }}的账号？
    </basicModal>

    <AddModal :addShowFlag
              @reload-table="reloadTable" />
    <EditModal :editShowFlag
               :editRowData
               @reload-table="reloadTable" />
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref, watch, onMounted } from 'vue';
import { BasicTable, TableAction } from '@/components/Table';
import { basicModal, useModal } from '@/components/Modal';
import { columns } from './columns';
import { DataTableRowKey, useMessage, useNotification } from 'naive-ui';
import {
  Add,
  PauseCircleOutline,
  Pencil,
  PlayCircleOutline,
  Reload,
  TrashOutline,
} from '@vicons/ionicons5';
import { delAccount, listAccount, syncAccount, updateListAccountOnline } from '@/api/account';
import AddModal from './AddModal.vue';
import type { editFormValue } from './EditModal.vue';
import EditModal from './EditModal.vue';
import { useFriendStore } from '@/store/modules/friend';
import { useAccountStore } from '@/store/modules/account';

const message = useMessage();
const friendStore = useFriendStore();
const accountStore = useAccountStore();
const actionRef = ref();
const [modalRegister, { openModal, closeModal }] = useModal({
  title: '系统提示',
});
onMounted(() => {});

let checkedRowKeys = ref<DataTableRowKey[]>([]);

let addShowFlag = ref<Number>(0);
let editShowFlag = ref<Number>(0);
let editRowData = ref<editFormValue>({
  sysAccountName: '',
  account: '',
  sysAccountLastName: '',
  sysAccountAbout: '',
});

let delSysAccountIds = ref<String>();

const actionColumn = reactive({
  width: 120,
  title() {
    return h('span', { style: { fontWeight: 'bold' } }, { default: () => '操作' });
  },
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction as any, {
      style: 'text',
      actions: [
        {
          label: '同步',
          onClick: handleSyncAccount.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ['basic_list'],
        },
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
          auth: ['basic_list'],
        },
        {
          label: '删除',
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ['basic_list'],
        },
      ],
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
  return await listAccount(queryParams, accountStore.filterParam).then((response) => {
    let data = response.data;

    data.rows.forEach((e) => {
      let str1 = e.sysAccountFirstName ? e.sysAccountFirstName : '';
      let str2 = e.sysAccountLastName ? e.sysAccountLastName : '';
      e.account = `${str1} ${str2}`;
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
  accountStore.filterParam = filters;
  reloadTable();
}

function onCheckedRow(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys;
}

function syncAccounts() {
  const newArray = JSON.parse(JSON.stringify(checkedRowKeys.value));
  const newObejctfrom = newArray[0];
  console.log(newObejctfrom);
  syncAccount(newObejctfrom).then(async (res) => {
    console.log(res);
    if (res.data.code == 200) {
      message.success('同步成功');
    } else if (res.data.code == 444) {
      message.error('账号失效');
    } else {
      message.error('同步失败');
    }

    reloadTable();
  });
}

function clickEditBtn() {
  editShowFlag.value += 1;

  editRowData.value.account = checkedRowKeys.value[0].account;
  editRowData.value.sysAccountName = checkedRowKeys.value[0].sysAccountName;
  editRowData.value.sysAccountLastName = checkedRowKeys.value[0].sysAccountLastName;
  editRowData.value.sysAccountAbout = checkedRowKeys.value[0].sysAccountAbout;
}

function handleEdit(record) {
  editShowFlag.value += 1;
  editRowData.value = record;
  message.success('您点击了编辑按钮');
}

async function handleSyncAccount(record? = checkedRowKeys.value) {
  const datalist = ref([]);
  const forValueList = JSON.parse(JSON.stringify(record));
  datalist.value.push(forValueList);
  await syncAccount(forValueList).then(async (res) => {
    console.log(res);
    if (res.data.code == 200) {
      message.success('同步成功');
    } else if (res.data.code == 444) {
      message.error('账号失效');
    } else {
      message.error('同步失败');
    }

    reloadTable();
  });
}

async function changAccountOnline(status) {
  status
    ? checkedRowKeys.value.forEach((e) => (e.sysAccountOnline = 0))
    : checkedRowKeys.value.forEach((e) => (e.sysAccountOnline = 1));
  await updateListAccountOnline(checkedRowKeys.value)
    .then(async (res) => {
      message.success('操作成功');
      reloadTable();
    })
    .catch((e) => {
      message.error('操作失败' + e);
    });
}

function handleDelete(record? = checkedRowKeys.value[0]) {
  openModal();
  delSysAccountIds.value = record.sysAccountId;
}

async function okModal() {
  await delAccount(delSysAccountIds.value).then(async (res) => {
    if (res.data.code == 200) {
      friendStore.getAccountList();
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
  () => accountStore.reloadTableFlag,
  (newValue) => {
    if (newValue) {
      reloadTable();
      accountStore.reloadTableFlag = false;
    }
  }
);
watch(
  () => friendStore.currentSysAccountId,
  () => reloadTable()
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
