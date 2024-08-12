import { defineStore } from 'pinia';

export const useGroupStore = defineStore('group', () => {
  const filterParam = {
    sysAccountStringSession: null,
    sysGroupTitle: null,
    sysGroupDetail: null,
    sysGroupSendMessage: null,
    sysGroupSendPhoto: null,
    sysGroupInvite: null,
  };

  const reloadTableFlag = false;

  return { filterParam, reloadTableFlag };
});
