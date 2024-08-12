<template>
  <div>
    <n-card :bordered="false" class="proCard">
      <n-grid :cols="100">
        <n-gi :span="32">
          <div class="button-group">
            <n-button
              type="primary"
              @click="handleSendMessage"
              :disabled="checkedRowKeys.length == 0"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <Add />
                </n-icon>
              </template>
              发送消息
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="primary"
              :disabled="checkedRowKeys.length == 0"
              @click="inviteShowFlag += 1"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <Pencil />
                </n-icon>
              </template>
              邀请入群
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="primary"
              :disabled="checkedRowKeys.length == 0"
              @click="syncAccount"
              class="button-with-badge"
            >
              <template #icon>
                <n-icon>
                  <Reload />
                </n-icon>
              </template>
              添加好友
              <span v-show="checkedRowKeys.length >= 1" class="badge">{{
                checkedRowKeys.length
              }}</span>
            </n-button>
            <n-button
              type="primary"
              @click="QunsyncAccount"
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
          </div>
          <n-data-table
            :data="groupData"
            :columns="groupColumns"
            :max-height="maxHeight"
            ref="tableElRef"
            :row-key="(row) => row"
            :checked-row-keys="checkedGroupRowKeys"
            @update:checked-row-keys="onCheckedGroupRow"
            :loading="groupTableLoading"
            style="margin-top: 15.5px"
          />
        </n-gi>
        <n-gi :span="68" style="padding-top:34px;">
          <BasicTable
            :columns="memberColumns"
            :dataSource="memberDataSource"
            ref="actionRef"
            :checked-row-keys="checkedRowKeys"
            @update:checked-row-keys="onCheckedRow"
            @update:filters="handleFiltersChange"
            :pagination="false"
            :loading="memberTableLoading"
            :row-key="(row) => row"
            :max-height="maxHeight - 30"
          >
            <!-- <template #toolbar>
              <n-button type="primary" @click="reloadTable" style="border-radius: 8px"
                >刷新数据</n-button
              >
            </template> -->
          </BasicTable>

          <n-pagination
            :display-order="['pages', 'size-picker', 'quick-jumper']"
            v-model:page="currentPage"
            show-quick-jumper
            show-size-picker
            :page-count="page"
            :item-count="total"
            :page-size="pageSize"
            :page-sizes="[20, 50, 100, 200, 500]"
            :on-update:page="onPageChange"
            :on-update:page-size="onPageSizeChange"
            style="display: flex; align-items: center; margin-top: 12px; justify-content: flex-end"
          >
            <template #prefix="{ itemCount, startIndex }"> 共{{ total }}条 </template>
          </n-pagination>
        </n-gi>
      </n-grid>
    </n-card>

    <SendMessage :messageShowFlag :sysConcatsList :memberTotalDataSource />
    <Invite :inviteShowFlag />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref, watch } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { memberColumns } from './memberColumns';
  import { groupColumns } from './groupColumns';
  import { DataTableRowKey, useMessage } from 'naive-ui';
  import { Add, Pencil, Reload,PlayCircleOutline } from '@vicons/ionicons5';
  import { syncAccount } from '@/api/account';
  import { useFriendStore } from '@/store/modules/friend';
  import { getGroupMember, listGroupAll } from '@/api/groupMember';
  import SendMessage from './SendMessage.vue';
  import Invite from './Invite.vue';
  import { getViewportOffset } from '@/utils/domUtils';
  import { useGroupMemberStore } from '@/store/modules/groupMember';
  import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

  const friendStore = useFriendStore();
  const groupMemberStore = useGroupMemberStore();
  const message = useMessage();
  const actionRef = ref();

  let currentPage = ref<Number>(1);
  let pageSize = ref<Number>(20);
  let total = ref<Number>(0);
  let page = ref<Number>(1);

  const tableElRef = ref<ComponentRef>(null);
  let maxHeight = ref<Number>(0);

  let checkedGroupRowKeys = ref<DataTableRowKey[]>([]);
  let checkedRowKeys = ref<DataTableRowKey[]>([]);

  let messageShowFlag = ref<Number>(0);
  let sysConcatsList = ref<String[]>([]);
  let inviteShowFlag = ref<Number>(0);

  let groupData = ref([]);
  let groupTableLoading = ref<Boolean>(false);

  let memberTotalDataSource = ref([]);
  let memberDataSource = ref([]);
  let memberTableLoading = ref<Boolean>(false);

  async function getGroupAllList(queryParams? = { page: 1, pageSize: 10000 }) {
    groupTableLoading.value = true;

    if (friendStore.currentSysAccountId === '') {
      groupTableLoading.value = false;
      return;
    }

    friendStore.accountList.forEach((e) => {
      if (friendStore.currentSysAccountId === e.sysAccountId)
        groupMemberStore.filterParam.sysAccountStringSession = e.sysAccountStringSession;
    });

    return await listGroupAll(queryParams, groupMemberStore.filterParam).then(async (response) => {
      groupData.value = response.data.rows;
      checkedGroupRowKeys.value = [];
      checkedGroupRowKeys.value.push(response.data.rows[0]);
      groupTableLoading.value = false;

      await getMemberList();
    });
  }

  async function onCheckedGroupRow(rowKeys: DataTableRowKey[]) {
    checkedGroupRowKeys.value = [];
    checkedGroupRowKeys.value.push(rowKeys[0]);
    checkedRowKeys.value = [];
    await getMemberList();
  }

  async function getMemberList() {
    memberTableLoading.value = true;

    if (checkedGroupRowKeys.value.length === 0) {
      memberTableLoading.value = false;
      return;
    }

    let param = checkedGroupRowKeys.value[0];

    return await getGroupMember(param).then((response) => {
      if (response.data.code === 200) {
        memberTotalDataSource.value = response.data.rows;

        let startIndex = (currentPage.value - 1) * pageSize.value;
        let endIndex = startIndex + pageSize.value;

        memberDataSource.value = memberTotalDataSource.value.slice(startIndex, endIndex);
        total.value = response.data.total;
      } else {
        memberDataSource.value = [];
        message.error(response.data.msg);
      }
      memberTableLoading.value = false;
    });
  }

  function QunsyncAccount(){
    const datas = [];
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
    groupMemberStore.groupMemberFilterParam = filters;
    reloadTable();
  }

  function onCheckedRow(rowKeys: DataTableRowKey[]) {
    checkedRowKeys.value = rowKeys;
  }

  async function handleSendMessage() {
    sysConcatsList.value = [];

    checkedRowKeys.value.forEach((item) => {
      sysConcatsList.value.push(item.sysContactId);
    });

    messageShowFlag.value += 1;
  }

  function reloadTable() {
    actionRef.value.reload();
    checkedRowKeys.value = [];
  }

  async function computeTableHeight() {
    const table = unref(tableElRef);
    const tableEl: any = table?.$el;
    const headEl = tableEl.querySelector('.n-data-table-thead ');
    const { bottomIncludeBody } = getViewportOffset(headEl);
    const headerH = 64;
    let paginationH = 2;
    let marginH = 24;

    let height = bottomIncludeBody - (headerH + paginationH + marginH);
    maxHeight.value = height;
    console.log(maxHeight);
  }

  function onPageChange(page: number) {
    currentPage.value = page;

    let startIndex = (currentPage.value - 1) * pageSize.value;
    let endIndex = startIndex + pageSize.value;

    memberDataSource.value = memberTotalDataSource.value.slice(startIndex, endIndex);
  }

  function onPageSizeChange(pageSizeSelected: number) {
    pageSize.value = pageSizeSelected;

    let startIndex = (currentPage.value - 1) * pageSize.value;
    let endIndex = startIndex + pageSize.value;

    memberDataSource.value = memberTotalDataSource.value.slice(startIndex, endIndex);
  }

  onMounted(() => {
    getGroupAllList();
    computeTableHeight();
  });

  watch(
    () => friendStore.currentSysAccountId,
    () => getGroupAllList()
  );

  watch(
    () => groupMemberStore.reloadTableFlag,
    (newValue) => {
      if (newValue) {
        getGroupAllList();
        groupMemberStore.reloadTableFlag = false;
      }
    }
  );

  watch(
    () => groupMemberStore.groupMemberReloadTableFlag,
    (newValue) => {
      if (newValue) {
        reloadTable();
        groupMemberStore.reloadTableFlag = false;
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
