<!--
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-08-22 13:18:42
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-08-30 18:50:27
 * @FilePath: \UI\src\views\VIPground\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="boxing">

   
    <div class="tabbos">
        <div class="flendbox">
            <div class="textone">注册数量</div>
            <div class="texttwo">{{total}}</div>
        </div>
        <div class="flendbox">
            <div class="textone">VIP用户</div>
            <div class="texttwo">{{datanum.vipNum}}</div>
        </div>
        <div class="flendbox">
            <div class="textone">在线数量</div>
            <div class="texttwo">{{datanum.inlineNum}}</div>
        </div>
    </div>

    <div style="padding-bottom: 20px;">
        <n-input v-model:value="value" type="text" placeholder="搜索用户" style="width: 300px;margin-right: 10px;"/>
        <n-button type="info">
      查询
    </n-button>
    </div>



    <n-table :single-line="false">
    <thead>
      <tr>
        <th>账号</th>
        <th>用户名</th>
        <th>vip等级</th>
        <th>登录账号数量</th>
        <th>登录状态</th>
        <th>到期时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in datalist" :key="index">
        <td>{{item.nickName}}</td>
        <td>{{item.userName}}</td>
        <td>{{item.accountDetailId==1?'非会员':'VIP'+parseInt(item.accountDetailId-1)}}</td>
        <td>{{item.accountNum}}</td>
        <td>{{item.loginStatus==0?'未登录':'登录'}}</td>
        <td>{{item.vipDate==null?'':item.vipDate +'天'}}</td>
        <td>
            <span class="fended" @click="getJobDetail(item.passwordOriginal,item.vipDate,item.accountDetailId,item)">编辑</span>

            <!-- <n-popconfirm
    @positive-click="dongjieClick"
    @negative-click="dongjieNegativeClick"
  >
    <template #trigger>
      <span class="fended padd">冻结</span>
    </template>
    是否冻结该账号？
  </n-popconfirm> -->

            <n-popconfirm
    @positive-click="handlePositiveClick(item.userId)"
    @negative-click="handleNegativeClick"
  >
    <template #trigger>
      <span class="fended padd">删除</span>
    </template>
    是否删除该账号？
  </n-popconfirm>

            
        </td>
      </tr>
      
    </tbody>
  </n-table>
</div>


<n-modal v-model:show="showModal"
           preset="card"
           style="width: 550px; border-radius: 8px">
    <template #header> 编辑信息 </template>
    <div >
      <div class="inpute">
        <span>密码：</span>
        <span>{{forpassword}}</span>
      </div>

      <div class="inpute">
        <span>到期天数：</span>
        <n-input-number v-model:value="datainged" clearable min="0"/>
        <span style="width: 20px;">天</span>
      </div>

      <div class="inpute">
        <span>会员等级：</span>
        <n-select v-model:value="valueid" :options="options"  style="width: 200px;"/>
      </div>

      <!-- <div class="inpute">
        <span>功能权限：</span>
        <n-input v-model:value="password" type="text" placeholder="请输入密码" />
      </div> -->
    </div>
    <template #action>
      <div class="action-button-group">
        <n-button type="default"
                  @click="showModal = false">取消</n-button>
        <n-button type="primary"
                  @click="confirmAction">确定</n-button>
      </div>
    </template>
  </n-modal>
  </div>
</template>
<script lang="ts" setup>
import { h, reactive, ref, watch,onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import {listVIP,VIPnum,VIPupdate,VIPdelete} from '@/api/VIPground';
import { tr } from 'date-fns/locale';
const valueid = ref('');
const showModal = ref(false);
const datalist = ref([]);
const datanum = ref([]);
const total = ref();
const vipid = ref();
const formdata = ref({});
const forpassword = ref();//密码
const datainged = ref();//到期时间
const message = useMessage();

    let data = {};
    listVIP(data).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
    VIPnum({}).then(res=>{
        datanum.value = res.data;
    })
   const handlePositiveClick =(id)=> {
    
    VIPdelete(id).then(res=>{
      datalist.value = [];
          listVIP({}).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
      message.success('删除成功')
    })
       
      }
      const handleNegativeClick = ()=> {
       
      }
      

      const getJobDetail = (id,date,vipid,item)=>{
        showModal.value = true;
        forpassword.value = id;
        datainged.value = date;
        formdata.value = item;
        console
        if(vipid == 1){
          valueid.value = '非会员';
        }else{
          valueid.value = 'VIP'+parseInt(vipid-1);
        }
       
        console.log(item);
      }
      const options = ref([
        {
          label: '非会员',
          value: '非会员'
          
        },
        {
          label: 'VIP1',
          value: 'VIP1'
        },
        {
          label: 'VIP2',
          value: 'VIP2'
        },
        {
          label: 'VIP3',
          value: 'VIP3'
        },
        {
          label: 'VIP4',
          value: 'VIP4'
        },
        {
          label: 'VIP5',
          value: 'VIP5'
        },
        {
          label: 'VIP6',
          value: 'VIP6'
        }
      ]) 
      const confirmAction = ()=>{
        console.log(valueid.value);
        
        switch (valueid.value) {
          case '非会员':
          vipid.value = 1;
            break;
            case 'VIP1':
          vipid.value = 2;
            break;
            case 'VIP2':
          vipid.value = 3;
            break;
            case 'VIP3':
          vipid.value = 4;
            break;
            case 'VIP4':
          vipid.value = 5;
            break;
            case 'VIP5':
          vipid.value = 6;
            break;
            case 'VIP6':
          vipid.value = 7;
            break;
          default:
            break;
        }
        formdata.value.vipDate = datainged.value;
        formdata.value.accountDetailId =  vipid.value;
        let data = formdata.value;
        console.log(JSON.stringify(data))
        VIPupdate(data).then(res=>{
          showModal.value = false;
          message.success(res.data.msg);
          datalist.value = [];
          listVIP({}).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
        })
      }
      
</script>
<style lang="less" scoped>
.boxing{
    background-color: #fff;
    border-radius: 5px;
    padding-bottom: 20px;
    padding: 20px;
}
.tabbos{
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 50px;
}
.flendbox{
    width: 200px;
    height: 100px; 
}
.textone{
    font-size: 30px;
    
}
.texttwo{
    font-size: 28px;
    color: #2D8CF0;
}
.fended{
  color: #2D8CF0;
  cursor: pointer;
}
.padd{
  padding: 0 10px;
}
.action-button-group {
  display: flex;
  justify-content: flex-end; /* Right align the buttons */
  gap: 8px; /* Optional: Add spacing between buttons */

  > .n-button {
    border-radius: 6px;
  }
}
.inpute{
  padding-bottom: 20px;
  display: flex;
  > .n-input{
    width: 200px;
  }
  > span{
    display: flex;
    width: 80px;
    flex-direction: row-reverse;
    align-items: center;
    
  }
}
</style>