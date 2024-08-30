/*
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-08-22 13:16:11
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-08-23 13:33:38
 * @FilePath: \UI\src\router\modules\VIPground.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {RouteRecordRaw} from 'vue-router';
import {Layout} from '@/router/constant';
import {TableOutlined} from '@vicons/antd';
import {renderIcon} from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */


const routes: Array<RouteRecordRaw> = [
  {
    path: '/VIPground',
    name: 'VIPground',
    component: Layout,
    meta: {
      icon: renderIcon(TableOutlined),
      isRoot: true,
      activeMenu: 'VIPground_index',
      sort: 105,
    },
    children: [
      {
        path: 'index',
        name: `VIPground_index`,
        meta: {
          title: '会员管理',
          activeMenu: 'VIPground_index',
        },
        component: () => import('@/views/VIPground/index.vue'),
      },
    ],
  },
];
  
 

export default routes;
