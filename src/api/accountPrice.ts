import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listDetail(query, data) {
  return request({
    url: '/backApi/system/detail/list',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}
