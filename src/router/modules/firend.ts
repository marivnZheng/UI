import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BookTwotone } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/friend',
    name: 'friend',
    component: Layout,
    meta: {
      icon: renderIcon(BookTwotone),
      isRoot: true,
      activeMenu: 'friend_index',
      sort: 101,
    },
    children: [
      {
        path: 'index',
        name: `friend_index`,
        meta: {
          title: '好友列表',
          activeMenu: 'friend_index',
        },
        component: () => import('@/views/friend/index.vue'),
      },
    ],
  },
];

export default routes;
