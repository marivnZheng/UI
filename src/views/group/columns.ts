import { BasicColumn } from '@/components/Table';
import { h, reactive } from 'vue';
import { NIcon, NInput, NSpace, NTag } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useGroupStore } from '@/store/modules/group';

const groupStore = useGroupStore();

export interface ListData {
  sysGroupTitle: string;
  sysGroupLink: string;
  sysGroupDetail: boolean;
  sysGroupSendMessage: number;
  sysGroupSendPhoto: number;
  sysGroupInvite: number;
}

export const columns: BasicColumn<ListData>[] = reactive([
  {
    type: 'selection',
    options: ['all', 'none'],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群组名称' });
    },
    key: 'sysGroupTitle',
    width: 170,
    filter: true,
    filterOptionValue: null,
    renderFilterIcon: () => {
      return h(NIcon, null, { default: () => h(SearchOutline) });
    },
    renderFilterMenu: ({ hide }) => {
      return h(
        NSpace,
        { style: { padding: '12px' }, vertical: true },
        {
          default: () => [
            h(NInput, {
              placeholder: '按下回车键进行搜索',
              value: columns[1].filterOptionValue,
              'onUpdate:value': (newValue) => {
                columns[1].filterOptionValue = newValue == '' ? null : newValue;
                groupStore.filterParam.sysGroupTitle = newValue == '' ? null : newValue;
              },
              onChange: () => (groupStore.reloadTableFlag = true),
            }),
          ],
        }
      );
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群组链接' });
    },
    key: 'sysGroupLink',
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
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群组信息' });
    },
    key: 'sysGroupDetail',
    width: 50,
    render(row) {
      return row.sysGroupDetail === 'false'
        ? h(NTag, { type: 'info', size: 'small' }, '频道')
        : h(NTag, { type: 'warning', size: 'small' }, '群组');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '频道',
        value: false,
      },
      {
        label: '群组',
        value: true,
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '消息限制' });
    },
    key: 'sysGroupSendMessage',
    width: 50,
    render(row) {
      return row.sysGroupSendMessage == '0'
        ? h(NTag, { type: 'error', size: 'small' }, '禁止')
        : row.sysGroupSendPhoto == '0'
        ? h(NTag, { type: 'warning', size: 'small' }, '禁图片')
        : h(NTag, { type: 'success', size: 'small' }, '无');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '允许发送',
        value: 1,
      },
      {
        label: '禁止发送',
        value: 0,
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '邀请入群' });
    },
    key: 'sysGroupInvite',
    width: 50,
    render(row) {
      return row.sysGroupInvite == '0'
        ? h(NTag, { type: 'error', size: 'small' }, '禁止')
        : h(NTag, { type: 'success', size: 'small' }, '允许');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '允许',
        value: 1,
      },
      {
        label: '禁止',
        value: 0,
      },
    ],
  },
]);
