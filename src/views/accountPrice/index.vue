<template>
  <div>
    <n-card bordered
            class="proCard">
      <BasicTable :columns="columns"
                  :request="getList"
                  :row-key="(row) => row.sysAccountId"
                  ref="actionRef"
                  :checked-row-keys="checkedRowKeys"
                  :scroll-x="1500">
      </BasicTable>

      <div class="tablecon">
        <div class="conle">其他说明</div>
        <div class="conle">无广告：试用会员使用系统发出的消息，尾部添加将本群发系统广告</div>
        <div class="conle">独立服务器：单人使用一台独立服务器，避免使用共用服务器时互相影响，引起官方风控，如需独立服务器，请联系客服开通</div>
        <div>群发账号：  温馨提醒使用九龙Telegram系统时，最好是用半年以上的老账号开通Telegram会员账号避免封号，引起官方风控，封号可以联系客服咨询</div>
      </div>
    </n-card>
    

  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref, watch } from 'vue';
import { BasicTable } from '@/components/Table';
import { basicModal, useModal } from '@/components/Modal';
import { listDetail } from '@/api/accountPrice';
import { columns } from './columns';
import { DataTableRowKey, useMessage } from 'naive-ui';
import { useFriendStore } from '@/store/modules/friend';
import { useAccountStore } from '@/store/modules/account';

const message = useMessage();
const friendStore = useFriendStore();
const accountStore = useAccountStore();
const actionRef = ref();
const [modalRegister, { openModal, closeModal }] = useModal({
  title: '系统提示',
});

let checkedRowKeys = ref<DataTableRowKey[]>([]);

let addShowFlag = ref<Number>(0);
let editShowFlag = ref<Number>(0);

let delSysAccountIds = ref<String>();

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
  return await listDetail(queryParams).then((response) => {
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
.tablecon{
  padding-top: 20px;
}
.conle{
  padding-bottom: 20px;
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
