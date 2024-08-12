import { BasicColumn } from '@/components/Table';
import { h, reactive } from 'vue';
import { NIcon, NInput, NSpace, NTag } from 'naive-ui';
import moment from 'moment-timezone';
import { SearchOutline } from '@vicons/ionicons5';
import { useTaskStore } from '@/store/modules/task';

const taskStore = useTaskStore();

export interface ListData {
  sysAccountName: string;
  jobName: string;
  jobStatus: string;
  jobType: string;
  tarNum: number;
  successNum: number;
  intervals: string;
  intervalLoop: string;
  createDate: string;
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
    key: 'sysAccountName',
    width: 100,
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
              value: columns[1].filterOptionValue,
              'onUpdate:value': (newValue) => {
                columns[1].filterOptionValue = newValue == '' ? null : newValue;
                taskStore.filterParam.sysAccountName = newValue == '' ? null : newValue;
              },
              onChange: () => (taskStore.reloadTableFlag = true),
            }),
          ],
        }
      );
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '任务名称' });
    },
    key: 'jobName',
    width: 200,
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '发送信息给用户',
        value: '发送信息给用户',
      },
      {
        label: '发送信息给频道',
        value: '发送信息给频道',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '任务状态' });
    },
    key: 'jobStatus',
    width: 80,
    render(row) {
      if (row.jobStatus == '0') return h(NTag, { type: 'warning', size: 'small' }, '已暂停');
      if (row.jobStatus == '1') return h(NTag, { size: 'small' }, '待执行');
      if (row.jobStatus == '2') return h(NTag, { type: 'info', size: 'small' }, '执行中');
      if (row.jobStatus == '3') return h(NTag, { type: 'success', size: 'small' }, '已完成');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '已暂停',
        value: '0',
      },
      {
        label: '待执行',
        value: '1',
      },
      {
        label: '执行中',
        value: '2',
      },
      {
        label: '已完成',
        value: '3',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '任务类型' });
    },
    key: 'jobType',
    width: 80,
    render(row) {
      return row.jobType == '1'
        ? h(NTag, { type: 'info', size: 'small' }, '单次')
        : h(NTag, { type: 'success', size: 'small' }, '循环');
    },
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '单次',
        value: '1',
      },
      {
        label: '循环',
        value: '0',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '目标数量' });
    },
    key: 'tarNum',
    width: 80,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '成功数量' });
    },
    key: 'successNum',
    width: 80,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '单个间隔' });
    },
    key: 'intervals',
    width: 80,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '循环间隔' });
    },
    key: 'intervalLoop',
    width: 80,
    
    render(row) {
      return row.intervalLoop === 'null' ? '' : row.intervalLoop
    },
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '创建时间' });
    },
    key: 'createDate',
    width: 150,
    render(row) {
      return h(
        'span',
        {},
        moment.tz(row.createDate, 'UTC').tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
      );
    },
    sorter: true,
    sortOrder: true,
  },
]);
