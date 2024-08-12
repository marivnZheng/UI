import { BasicColumn } from '@/components/Table';
import {h, reactive} from 'vue';
import { NIcon, NInput, NSpace, NTag } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useGroupMemberStore } from '@/store/modules/groupMember';

const groupMemberStore = useGroupMemberStore();

export interface ListData {
  sysContactName: string;
  sysContactPhone: string;
  sysContactUserName: string;
  sysMutualContact: number;
  sysStatus: number;
}

export const memberColumns: BasicColumn<ListData>[] = reactive([
  {
    type: 'selection',
    options: ['all', 'none'],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '用户名称' });
    },
    key: 'sysContactName',
    width: 200,
    filter: true,
    filterOptionValue: null,
    renderFilterIcon: () => {
      return h(NIcon, null, { default: () => h(SearchOutline) });
    },
    renderFilterMenu: () => {
      return h(
        NSpace,
        { style: { padding: '12px' }, vertical: true },
        {
          default: () => [
            h(NInput, {
              placeholder: '按下回车键进行搜索',
              value: memberColumns[1].filterOptionValue,
              'onUpdate:value': (newValue) => {
                memberColumns[1].filterOptionValue = newValue == '' ? null : newValue;
                groupMemberStore.groupMemberFilterParam.sysContactName = newValue == '' ? null : newValue;
              },
              onChange: () => (groupMemberStore.groupMemberReloadTableFlag = true),
            }),
          ],
        }
      );
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '手机号' });
    },
    key: 'sysContactPhone',
    width: 100,
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '有',
        value: 'true',
      },
      {
        label: '无',
        value: 'false',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '用户名' });
    },
    key: 'sysContactUserName',
    width: 170,
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '有',
        value: 'true',
      },
      {
        label: '无',
        value: 'false',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '双向好友' });
    },
    key: 'sysMutualContact',
    width: 100,
    render(row) {
      return row.sysMutualContact == 0
        ? h(NTag, { type: 'success', size: 'small' }, '是')
        : h(NTag, { type: 'error', size: 'small' }, '否');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '是',
        value: '0',
      },
      {
        label: '否',
        value: '1',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '账号状态' });
    },
    key: 'sysStatus',
    width: 100,
    render(row) {
      return row.sysStatus == 1
        ? h(NTag, { type: 'success', size: 'small' }, '在用')
        : h(NTag, { type: 'error', size: 'small' }, '禁用');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '在用',
        value: '1',
      },
      {
        label: '注销',
        value: '0',
      },
    ],
  },
]);
