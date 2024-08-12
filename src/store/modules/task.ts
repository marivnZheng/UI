import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', () => {
  const filterParam = {
    sysAccountName: null,
    jobName: null,
    jobStatus: null,
    jobType: null,
    tarNum: null,
    successNum: null,
    intervals: null,
    intervalLoop: null,
    createDate: null,
  };

  const reloadTableFlag = false;

  const taskDetailFilterParam = {
    targ: null,
    jobDetailStatus: null,
    msg: null,
    jobDetailDate: null,
  };

  const taskDetailReloadTableFlag = false;

  return { filterParam, reloadTableFlag, taskDetailFilterParam, taskDetailReloadTableFlag };
});
