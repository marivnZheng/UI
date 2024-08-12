import request from '@/utils/request';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';

// 查询列表
export function listTask(query, data) {
  return request({
    url: '/backApi/system/task/list',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    params: query,
    data: data,
  });
}

export function resend(data) {
  return request({
    url: '/backApi/system/task/resend',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function deleteTaskList(data) {
  return request({
    url: '/backApi/system/task/deleteList',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
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

export function sendMessagePrivate(data) {
  return request({
    url: '/backApi/system/task/sendMessagePrivate',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
export function UserInfor(data) {
  return request({
    url: '/backApi/system/account/getCurrentUser/',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}

export function getJobDetail(data) {
  return request({
    url: '/backApi/system/task/getJobDetail',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + storage.get(CURRENT_USER, {}).token,
    },
    data: data,
  });
}
