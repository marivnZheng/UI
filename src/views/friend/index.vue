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
              添加好友
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length == 0"
                      @click="handleSendMessage(null)"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              发送信息
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="primary"
                      @click="syncFriend"
                      :loading="syncBtnLoading">
              <template #icon>
                <n-icon>
                  <Reload />
                </n-icon>
              </template>
              同步好友
            </n-button>
            <n-button type="primary"
                      :disabled="checkedRowKeys.length == 0"
                      @click="inviteShowFlag += 1"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <PlayCircleOutline />
                </n-icon>
              </template>
              邀请进群
              <span v-show="checkedRowKeys.length >= 1"
                    class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button type="primary"
                      @click="synchronousAccount"
                      class="button-with-badge">
              <template #icon>
                <n-icon>
                  <PlayCircleOutline />
                </n-icon>
              </template>
              导出
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

    <AddModal :addShowFlag
              @reload-table="reloadTable" />
    <SendMessage :messageShowFlag
                 :sysConcatsList />
    <Invite :inviteShowFlag
            :checkedRowKeys />
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref, watch } from 'vue';
import { BasicTable, TableAction } from '@/components/Table';
import { columns } from './columns';
import { DataTableRowKey, useMessage } from 'naive-ui';
import { Add, PauseCircleOutline, Pencil, PlayCircleOutline, Reload } from '@vicons/ionicons5';
import AddModal from './AddModal.vue';
import { listConcat, syncConcat,sysAccount } from '@/api/friend';
import { useFriendStore } from '@/store/modules/friend';
import SendMessage from './SendMessage.vue';
import Invite from './Invite.vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const friendStore = useFriendStore();
const message = useMessage();
const actionRef = ref();
const memberTotalDataSource = ref();
let checkedRowKeys = ref<DataTableRowKey[]>([]);

let addShowFlag = ref<Number>(0);
let messageShowFlag = ref<Number>(0);
let sysConcatsList = ref<String[]>([]);
let inviteShowFlag = ref<Number>(0);

let syncBtnLoading = ref<Boolean>(false);

const actionColumn = reactive({
  width: 45,
  title(column) {
    return h('span', { style: { fontWeight: 'bold' } }, { default: () => '操作' });
  },
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction as any, {
      style: 'text',
      actions: [
        {
          label: '发送消息',
          onClick: handleSendMessage.bind(null, record),
        },
      ],
      select: (key) => {
        window['$message'].info(`您点击了，${key} 按钮`);
      },
    });
  },
});

async function getList(queryParams) {
  if (friendStore.currentSysAccountId === '') return;

  friendStore.filterParam.sysAccountId = friendStore.currentSysAccountId;

  return await listConcat(queryParams, friendStore.filterParam).then((response) => {
    let data = response.data;
    memberTotalDataSource.value =data.rows;
    return {
      ...queryParams,
      pageCount: Math.ceil(data.total / queryParams.pageSize),
      itemCount: data.total,
      list: data.rows,
    };
  });
}

async function synchronousAccount(){
  const datas = [];
  console.log(memberTotalDataSource.value);
   memberTotalDataSource.value.forEach((item)=>{
   datas.push(
     {'用户名称':item.sysContactName,'手机号':'',
     '用户名':item.sysContactUserName,
'双向好友':item.sysMutualContact==0?'是':'否',
     '账号状态':item.sysStatus==1?'在用':'禁用'}
      
    )
    })
    message.success('导出成功');
    const ws = XLSX.utils.json_to_sheet(datas);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
 
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
 
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'data.xlsx');
  }



function handleFiltersChange(filters) {
  friendStore.filterParam = filters;
  reloadTable();
}

function onCheckedRow(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys;
}

async function syncFriend() {
  syncBtnLoading.value = true;
  let param = friendStore.accountList.filter(
    (e) => friendStore.currentSysAccountId === e.sysAccountId
  );
  await syncConcat(param).then((res) => {
    if (res.data.code === 200) {
      message.success('同步成功');
      syncBtnLoading.value = false;
      reloadTable();
    }
  });
}

async function handleSendMessage(record? = checkedRowKeys.value) {
  sysConcatsList.value = [];
  if (record) sysConcatsList.value.push(record.sysContactId);
  else
    checkedRowKeys.value.forEach((item) => {
      sysConcatsList.value.push(item.sysContactId);
    });

  messageShowFlag.value += 1;
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
  () => friendStore.reloadTableFlag,
  (newValue) => {
    if (newValue) {
      reloadTable();
      friendStore.reloadTableFlag = false;
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
