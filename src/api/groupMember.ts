import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listGroupAll(query, data) {
  return request({
    url: '/backApi/system/group/listGroupAll',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}

export function getGroupMember(data) {
  return request({
    url: '/backApi/system/group/getGroupMember',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
