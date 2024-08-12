/*
 * @Author: fantao 937168457@qq.com
 * @Date: 2024-07-23 16:20:15
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-07-28 21:59:27
 * @FilePath: \naive-ui-admin\src\api\system\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http/axios';
import request from '@/utils/request';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/admin_info',
    method: 'get',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return request({
    url: '/backApi/login',
    // url: 'http://154.211.14.61:8080/login',
    method: 'POST',
    data: params,
  });
}

// export function login(params) {
//   return http.request<BasicResponseModel>(
//     {
//       url: '/login',
//       method: 'POST',
//       params,
//     },
//     {
//       isTransformResponse: false,
//     }
//   );
// }

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: '/login/logout',
    method: 'POST',
    params,
  });
}
/**
 * @description: 用户邮箱
 */
export function SendMall(params) {
  return request({
    url: '/backApi/sendMail',
    method: 'POST',
    params,
  });
}
/**
 * @description: 用户注册
 */
export function register(params) {
  return request({
    url: '/backApi/register',
    method: 'POST',
    data: params,
  });
}
