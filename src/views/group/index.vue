<template>
  <div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :request="getList"
        :row-key="(row) => row"
        ref="actionRef"
        :actionColumn="actionColumn"
        :checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="onCheckedRow"
        @update:filters="handleFiltersChange"
        :loading
        :scroll-x="1200"
      >
        <template #tableTitle>
          <div class="button-group">
            <n-button type="primary" @click="addShowFlag += 1">
              <template #icon>
                <n-icon>
                  <Add />
                </n-icon>
              </template>
              添加群组
            </n-button>
            <n-button
              type="primary"
              :disabled="checkedRowKeys.length == 0"
              @click="handleSendMessage(null)"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              发送信息 
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="primary"
              :loading="syncBtnLoading"
              @click="syncGroupBtn"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <Reload />
                </n-icon>
              </template>
              同步群组
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="primary"
              @click="synchronousAccount()"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <PlayCircleOutline />
                </n-icon>
              </template>
              导出
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="error"
              :disabled="checkedRowKeys.length == 0"
              @click="changAccountOnline(flase)"
              class="button-with-badge"
              dashed
            >
              <template #icon>
                <n-icon>
                  <PauseCircleOutline />
                </n-icon>
              </template>
              删除
            </n-button>
          </div>
        </template>

        <!-- <template #toolbar>
          <n-button type="primary" @click="reloadTable" style="border-radius: 8px"
            >刷新数据</n-button
          >
        </template> -->
      </BasicTable>
    </n-card>

    <basicModal @register="modalRegister" ref="modalRef" class="basicModal" @on-ok="okModal">
      是否确认删除编号为{{ delSysGroupId }}的群组？
    </basicModal>

    <AddModal :addShowFlag @reload-table="reloadTable" />
    <SendMessage :messageShowFlag :groupList />
  </div>
</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns } from './columns';
  import { DataTableRowKey, useMessage } from 'naive-ui';
  import { Add, PauseCircleOutline, Pencil, PlayCircleOutline, Reload } from '@vicons/ionicons5';
  import AddModal from './AddModal.vue';
  import { useFriendStore } from '@/store/modules/friend';
  import { delGroup, listGroup, syncGroup,TongGroup } from '@/api/group';
  import SendMessage from './SendMessage.vue';
  import { useGroupStore } from '@/store/modules/group';
import { func } from 'vue-types';
import { flatMap } from 'lodash';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

  const friendStore = useFriendStore();
  const groupStore = useGroupStore();
  const message = useMessage();
  const actionRef = ref();
  const memberTotalDataSource = ref();
  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '系统提示',
  });

  let checkedRowKeys = ref<DataTableRowKey[]>([]);

  let addShowFlag = ref<Number>(0);
  let messageShowFlag = ref<Number>(0);
  let groupList = ref<String[]>([]);

  let delSysGroupId = ref<String>();

  let syncBtnLoading = ref<Boolean>(false);
  let loading = ref<Boolean>(true);

  const actionColumn = reactive({
    width: 60,
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
            disabled: record.sysGroupDetail === 'false',
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  async function getList(queryParams? = { page: 1, pageSize: 10 }) {
    loading.value = true;
    if (friendStore.currentSysAccountId === '') {
      loading.value = false;
      return;
    }

    friendStore.accountList.forEach((e) => {
      if (friendStore.currentSysAccountId === e.sysAccountId)
        groupStore.filterParam.sysAccountStringSession = e.sysAccountStringSession;
    });

    return await listGroup(queryParams, groupStore.filterParam).then((response) => {
      let data = response.data;
      memberTotalDataSource.value =data.rows;
      loading.value = false;

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
     {'群组名称':item.sysGroupTitle,
     '群组链接':item.sysGroupLink,
'群组信息':item.sysGroupDetail==false?'频道':'群组',
     '消息限制':item.sysGroupSendMessage==0?'禁止':item.sysGroupSendPhoto==0?'禁图片':'无',
    '邀请入群':item.sysGroupInvite==0?'禁止':'允许'}
      
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


    //获取接口二进制流-导出表格xlsx
      // let data = {}
      // await TongGroup(data).then(res=>{
      //   console.log(res);
      //   sysccount(res.data);
      // })
  }
  function sysccount(binFile,blobType= 'application/octet-stream'){
         message.success('导出成功');
        const blobObj = new Blob([binFile],{type:blobType});
        const downloadLink = document.createElement('a');
        let url = window.URL || window.webkitURL;
        url = url.createObjectURL(blobObj);
        downloadLink.href = url;
        downloadLink.download = '导出数据.XLSX';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

  }
  function handleFiltersChange(filters) {
    groupStore.filterParam = filters;
    reloadTable();
  }

  function onCheckedRow(rowKeys: DataTableRowKey[]) {
    checkedRowKeys.value = rowKeys;
  }

  async function syncGroupBtn() {
    syncBtnLoading.value = true;

    let param = friendStore.accountList.filter(
      (item) => item.sysAccountId == friendStore.currentSysAccountId
    );

    await syncGroup(param).then((res) => {
      if (res.status === 200) {
        reloadTable();
      } else message.error(res.data.message);
    });

    syncBtnLoading.value = false;
  }

  function handleDelete(record? = checkedRowKeys.value[0]) {
    openModal();
    delSysGroupId.value = record.sysGroupId;
  }

  async function okModal() {
    await delGroup(delSysGroupId.value).then(async (res) => {
      if (res.data.code == 200) {
        message.success('删除成功');
        closeModal();
        reloadTable();
      }
    });
  }

  async function handleSendMessage(record? = checkedRowKeys.value) {
    groupList.value = [];
    if (record) groupList.value.push(record.sysGroupId);
    else
      checkedRowKeys.value.forEach((item) => {
        groupList.value.push(item.sysGroupId);
      });

    console.log(groupList.value);

    messageShowFlag.value += 1;
  }

  function reloadTable() {
    actionRef.value.reload();
    checkedRowKeys.value = [];
  }

  onMounted(reloadTable);

  watch(
    () => friendStore.currentSysAccountId,
    () => reloadTable()
  );

  watch(
    () => groupStore.reloadTableFlag,
    (newValue) => {
      if (newValue) {
        reloadTable();
        groupStore.reloadTableFlag = false;
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
