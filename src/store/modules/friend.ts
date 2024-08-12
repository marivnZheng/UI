import { defineStore } from 'pinia';
import { listOnlineAccount } from '@/api/friend';
import { ref } from 'vue';

export const useFriendStore = defineStore('friend', () => {
  const currentSysAccountId = ref<String>('');
  const accountList = ref([]);

  const filterParam = {
    sysAccountId: null,
    sysContactName: null,
    sysContactPhone: null,
    sysContactUserName: null,
    sysMutualContact: null,
    sysStatus: null,
  };

  const reloadTableFlag = false;

  async function getAccountList() {
    let data = null;
    await listOnlineAccount({}).then((response) => {
      if (response.data.code === 200) {
        response.data.rows.forEach((e) => {
          e.TgName = e.sysAccountFirstName
            ? e.sysAccountFirstName
            : '' + ' ' + e.sysAccountLastName
            ? e.sysAccountLastName
            : '';
        });
        data = response.data.rows;
        accountList.value = response.data.rows;
      }
    });
    return data;
  }

  return { currentSysAccountId, accountList, getAccountList, filterParam, reloadTableFlag };
});
