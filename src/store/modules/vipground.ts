/*
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-09-02 00:09:49
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-09-02 00:10:51
 * @FilePath: \UI\src\store\modules\vipground.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';

export const useGroupStore = defineStore('group', () => {
  const filterParam = {
    userName:'啊'
  };

  const reloadTableFlag = false;

  return { filterParam, reloadTableFlag };
});
