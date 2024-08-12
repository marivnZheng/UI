import { BasicColumn } from '@/components/Table';
import { h, reactive, ref } from 'vue';
import { NIcon, NInput, NSpace, NSwitch, NTag } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useAccountStore } from '@/store/modules/account';

const accountStore = useAccountStore();

export interface ListData {
  account: string;
  sysAccountName: string;
  sysAccountConcatsNumber: number;
  sysAccountGroupNumber: number;
  sysAccountCreateTime: string;
  sysAccountCreateTimezone: string;
  sysAccountOnline: number;
  sysAccountOffline: number;
}

export const columns: BasicColumn<ListData>[] = reactive([
  {
    type: 'selection',
    options: ['all', 'none'],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '账号' });
    },
    key: 'account',
    width: 200,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '用户名' });
    },
    key: 'sysAccountName',
    width: 100,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '手机号码' });
    },
    key: 'sysAccountPhone',
    width: 170,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '好友数量' });
    },
    key: 'sysAccountConcatsNumber',
    auth: ['basic_list'], // 同时根据权限控制是否显示
    ifShow: (_column) => {
      return true; // 根据业务控制是否显示
    },
    width: 100,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群组数量' });
    },
    key: 'sysAccountGroupNumber',
    width: 100,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '在线状态' });
    },
    key: 'sysAccountOnline',
    width: 100,
    render(row) {
      return h(
        NSwitch,
        {
          'default-value': row.sysAccountOnline === 0,
          size: 'small',
          'onUpdate:value': (newValue) => {
            console.log(newValue);
          },
        },
        {
          checked: () => '在线',
          unchecked: () => '离线',
        }
      );
    },
    filterMultiple: false,
    filterOptions: [
      {
        label: '在线',
        value: 0,
      },
      {
        label: '离线',
        value: 1,
      },
    ],
    filter: true,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '登录状态' });
    },
    key: 'sysAccountLoginStatus',
    width: 100,
    render(row) {
      return row.sysAccountLoginStatus === 0
        ? h(NTag, { type: 'success', size: 'small' }, '可用')
        : h(NTag, { type: 'error', size: 'small' }, '不可用');
    },
    // render(row) {
    //   return row.sysAccountOnline === 0
    //     ? h(NIcon, {}, [h(SearchOutline)])
    //     : h(NTag, { type: 'error', size: 'small' }, '不可用');
    // },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '创建时间' });
    },
    key: 'sysAccountCreateTime',
    width: 160,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '账号新增时间时区' });
    },
    key: 'sysAccountCreateTimezone',
    width: 160,
  },
]);

// export function handleUpdateFilter(
//   filters: DataTableFilterState,
//   sourceColumn: DataTableBaseColumn
// ) {
//   columns[6].filterOptionValue = filters[sourceColumn.key] as string;
//   console.log(columns[6].filterOptionValue);
// }
