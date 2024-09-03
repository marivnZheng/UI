/*
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-08-22 15:13:58
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-09-02 00:12:04
 * @FilePath: \UI\src\api\VIPground.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listVIP(query, data) {
  return request({
    url: '/backApi/system/user/list',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}
// 会员数量
export function VIPnum(query, data) {
  return request({
    url: '/backApi/system/user/getNumber',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}
// 会员编辑
export function VIPupdate(data) {
  return request({
    url: '/backApi/system/user',
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
// 会员删除
export function VIPdelete(userid) {
  return request({
    url: '/backApi/system/user/' + userid,
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
  });
}
