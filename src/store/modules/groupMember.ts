import { defineStore } from 'pinia';

export const useGroupMemberStore = defineStore('groupMember', () => {
  const filterParam = {
    sysGroupTitle: null,
  };

  const groupMemberFilterParam = {
    sysAccountStringSession: null,
    sysContactName: null,
    sysContactPhone: null,
    sysContactUserName: null,
    sysMutualContact: null,
    sysStatus: null,
  };

  const reloadTableFlag = false;

  const groupMemberReloadTableFlag = false;

  return { filterParam, reloadTableFlag, groupMemberFilterParam, groupMemberReloadTableFlag };
});
