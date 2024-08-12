import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import request from '@/utils/request';

export function listOnlineAccount(data) {
  return request({
    url: '/backApi/system/account/ListOnline',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function listConcat(query, data) {
  return request({
    url: '/backApi/system/contacts/list',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}

export function exportSyncConcat(data) {
  return request({
    url: '/backApi/system/contacts/exportSyncConcat',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function listAllConcat(query) {
  return request({
    url: '/backApi/system/contacts/listAll',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
  });
}

export function addConcatTg(data) {
  return request({
    url: '/backApi/system/contacts/addContactsTg',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function addConcatTgPhone(data) {
  return request({
    url: '/backApi/system/contacts/addContactsTgPhone',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function syncConcat(data) {
  return request({
    url: '/backApi/system/contacts/syncContas',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

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

export function inviteGroup(data) {
  return request({
    url: '/backApi/system/group/inviteGroup',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function listFriendAll(query) {
  return request({
    url: '/backApi/system/contacts/listAll',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
  });
}

export function listGroupAll(query) {
  return request({
    url: '/backApi/system/group/listGroupAll',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: query,
  });
}

export function sendMessage(data) {
  return request({
    url: '/backApi/system/task/sendMessage',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
export function sysAccount(data) {
  return request({
    url: '/backApi/system/contacts/exportSyncConcat',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

