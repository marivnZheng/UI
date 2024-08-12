import { BasicColumn } from '@/components/Table';
import { h, reactive } from 'vue';
import { NIcon, NInput, NSpace } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useGroupMemberStore } from '@/store/modules/groupMember';

const groupMemberStore = useGroupMemberStore();

export interface ListData {
  sysGroupTitle: string;
}

export const groupColumns: BasicColumn<ListData>[] = reactive([
  {
    type: 'selection',
    multiple: false,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '群组名称' });
    },
    key: 'sysGroupTitle',
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
              value: groupColumns[1].filterOptionValue,
              'onUpdate:value': (newValue) => {
                groupColumns[1].filterOptionValue = newValue == '' ? null : newValue;
                groupMemberStore.filterParam.sysGroupTitle = newValue == '' ? null : newValue;
              },
              onChange: () => (groupMemberStore.reloadTableFlag = true),
            }),
          ],
        }
      );
    },
  },
]);
