/*
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-07-23 16:20:15
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-08-08 19:21:21
 * @FilePath: \naive-ui-admin\src\api\group.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listGroup(query, data) {
  return request({
    url: '/backApi/system/group/list',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}

export function syncGroup(data) {
  return request({
    url: '/backApi/system/group/syncGroup',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function inviteGroupList(data) {
  return request({
    url: '/backApi/system/group/inviteGroupList',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

// 删除
export function delGroup(sysGroupId) {
  return request({
    url: '/backApi/system/group/' + sysGroupId,
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
  });
}
// 删除
export function TongGroup(data) {
  return request({
    url: '/backApi/system/group/exportGroup',
    method: 'post',
    responseType:'blob',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

