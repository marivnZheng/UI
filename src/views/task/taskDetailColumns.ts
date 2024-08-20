import { BasicColumn } from '@/components/Table';
import { h, reactive } from 'vue';
import { NTag } from 'naive-ui';
import moment from 'moment-timezone';

export interface ListData {
  targ: string;
  jobDetailStatus: number;
  msg: string;
  jobDetailDate: string;
}

export const taskDetailColumns: BasicColumn<ListData>[] = reactive([
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '任务目标' });
    },
    key: 'targ',
    width: 150,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '任务结果' });
    },
    key: 'jobDetailStatus',
    width: 130,
    render(row) {
      return row.jobDetailStatus == 0
        ? h(NTag, { type: 'success', size: 'small' }, '成功')
        : h(NTag, { type: 'error', size: 'small' }, '失败');
    },
    // filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: '成功',
        value: '0',
      },
      {
        label: '失败',
        value: '1',
      },
    ],
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '失败原因' });
    },
    key: 'msg',
    width: 300,
  },
  {
    title() {
      return h('span', { style: { fontWeight: 'bold' } }, { default: () => '执行时间' });
    },
    key: 'jobDetailDate',
    width: 200,
    render(row) {
      return h(
        'span',
        {},
        moment.tz(row.jobDetailDate, 'UTC').tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
      );
    },
  },
]);
