import { BasicColumn } from '@/components/Table';
import { h, reactive, ref } from 'vue';
import { NIcon, NInput, NSpace, NSwitch, NTag } from 'naive-ui';
import { CloseCircleOutlined, CheckCircleOutlined } from '@vicons/antd';
import { useAccountStore } from '@/store/modules/account';
import { color } from 'echarts';
import { size } from 'lodash';

const accountStore = useAccountStore();

export interface ListData {
  addGroup: number;
  sendGroupMessage: number;
  forwardMessage: number;
  privateDevice: number;
  pullPeopleJoinGroup: number;
  privateSendMessage: number;
}

export const columns: BasicColumn<ListData>[] = reactive([
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '会员类型' });
    },
    key: 'vipType',
    width: 200,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '月费' });
    },
    key: 'price',
    width: 100,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '账号数' });
    },
    key: 'accountNum',
    width: 170,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群发消息' });
    },
    key: 'sendGroupMessage',
    render(row) {
      return row.sendGroupMessage === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
    width: 100,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '批量加群' });
    },
    key: 'addGroup',
    width: 100,
    render(row) {
      return row.addGroup === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '批量私聊' });
    },
    key: 'privateSendMessage',
    width: 100,
    render(row) {
      return row.privateSendMessage === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '指定群拉人' });
    },
    key: 'pullPeopleJoinGroup',
    width: 100,
    render(row) {
      return row.pullPeopleJoinGroup === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '转发消息' });
    },
    key: 'forwardMessage',
    width: 160,
    render(row) {
      return row.forwardMessage === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '独立服务器' });
    },
    key: 'privateDevice',
    width: 160,
    render(row) {
      return row.privateDevice === 0
        ? h(NIcon, {}, [
            h(CheckCircleOutlined, {
              style: { color: 'green', fontSize: '15px' },
            }),
          ])
        : h(NIcon, {}, [h(CloseCircleOutlined, { style: { color: 'red', fontSize: '15px' } })]);
    },
  },
]);

// export function handleUpdateFilter(
//   filters: DataTableFilterState,
//   sourceColumn: DataTableBaseColumn
// ) {
//   columns[6].filterOptionValue = filters[sourceColumn.key] as string;
//   console.log(columns[6].filterOptionValue);
// }
