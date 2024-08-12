import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', () => {
  const filterParam = {
    sysAccountLastName: null,
    sysAccountFirstName: null,
    sysAccountName: null,
    sysAccountPhone: null,
    sysAccountConcatsNumber: null,
    sysAccountGroupNumber: null,
    sysAccountCreateTime: null,
    sysAccountCreateTimezone: null,
    sysAccountOnline: null,
    sysAccountOffline: null,
  };

  const reloadTableFlag = false;

  return { filterParam, reloadTableFlag };
});
