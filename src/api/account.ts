import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listAccount(query, data) {
  return request({
    url: '/backApi/system/account/list',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}

export function syncAccount(data) {
  return request({
    url: '/backApi/system/account/syncAccount/',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: [data],
  });
}

export function updateListAccountOnline(data) {
  return request({
    url: '/backApi/system/account/updateListAccountOnline',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function delAccount(sysAccountId) {
  return request({
    url: '/backApi/system/account/' + sysAccountId,
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
  });
}
export function checkPhoneAndUserJurisdiction(phoneNumber) {
  return request({
    url: '/backApi/system/account/checkPhoneAndUserJurisdiction/' + phoneNumber,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
  });
}

export function sendPhoneCode(phoneNumber) {
  return request({
    url: '/backApi/system/account/sendPhoneCode/' + phoneNumber,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
  });
}

export function loginAccountByPhoneCode(data) {
  return request({
    url: '/backApi/system/account/loginAccountByPhoneCode/',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function sessionFileLogin(data) {
  return request({
    url: '/backApi/system/account/sessionFileLogin/',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function editAccountDetail(data) {
  return request({
    url: '/backApi/system/account/editAccountDetail',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
