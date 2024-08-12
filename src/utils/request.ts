import axios from 'axios';
import { getToken } from '@/utils/auth';
import router from '@/router';

export const isRelogin = { show: false };

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;

    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use((res) => {
  console.log(res);
  const code = res.data.code || 200;
  if (code === 401) {
    console.log(res);
    if (!isRelogin.show) {
      isRelogin.show = true;
      // message.error('登录状态已过期，请重新登录');
      router
        .push('/login')
        .finally(() => {
          isRelogin.show = false;
          location.reload();
        })
        .catch(() => {
          isRelogin.show = false;
        });
    }
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
  }
  return res;
});

export default service;
