<!--
 * @Author: 圆圆的麻园 937168457@qq.com
 * @Date: 2024-08-22 13:18:42
 * @LastEditors: 圆圆的麻园 937168457@qq.com
 * @LastEditTime: 2024-09-02 20:03:34
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

    <div style="display: flex;">
      <div style="padding-bottom: 20px;padding-right: 40px;">
        <n-input v-model:value="valuename.userName" type="text" placeholder="请输入" style="width: 150px;margin-right: 10px;"/>
        <n-button type="info" @click="getName">
      查询
    </n-button>
    </div>

    <!-- <div style="padding-bottom: 20px;">
        <n-input v-model:value="valuename.nickName" type="text" placeholder="请输入账号" style="width: 150px;margin-right: 10px;"/>
        <n-button type="info" @click="getName">
      账号查询
    </n-button>
    </div> -->
    </div>
    



    <n-table :single-line="true">
    <thead>
      <tr>
        <th style="width: 8%;">账号</th>
        <th style="width: 13%;">

          <div class="fovm">
            <span>用户名</span>

            <n-popover
      placement="bottom"
      trigger="click"
      @update:show="handleUpdateShow"
    >
      <template #trigger>
        <i role="img" class="n-icon" style="--n-bezier:cubic-bezier(0.4, 0, 0.2, 1);color: rgb(208, 208, 211);cursor: pointer;font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns-xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
              <path d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path>
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"></path>
            </svg>
          </i>
      </template>
      <div style="display: flex;">
        <n-input v-model:value="valuename.userName" type="text" placeholder="请输入" style="width: 150px;margin-right: 5px"/>
        <n-button type="info" @click="getName">
      查询
    </n-button>
  </div>
    </n-popover>
          </div>
          
        </th>
        <th style="width: 17%;">登录时间</th>
        <th style="width: 12%;">注册时间</th>
        <th style="width: 8%;">原始密码</th>
        <th style="width: 8%;">
          <div class="fovm">
            <span>vip等级</span>

            <n-popover
      placement="bottom"
      trigger="click"
      @update:show="handleUpdateShow" 
    >
      <template #trigger>
        <i class="n-base-icon">
            <svg viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <path d="M17,19 C17.5522847,19 18,19.4477153 18,20 C18,20.5522847 17.5522847,21 17,21 L11,21 C10.4477153,21 10,20.5522847 10,20 C10,19.4477153 10.4477153,19 11,19 L17,19 Z M21,13 C21.5522847,13 22,13.4477153 22,14 C22,14.5522847 21.5522847,15 21,15 L7,15 C6.44771525,15 6,14.5522847 6,14 C6,13.4477153 6.44771525,13 7,13 L21,13 Z M24,7 C24.5522847,7 25,7.44771525 25,8 C25,8.55228475 24.5522847,9 24,9 L4,9 C3.44771525,9 3,8.55228475 3,8 C3,7.44771525 3.44771525,7 4,7 L24,7 Z">
</path>
                </g>
              </g>
            </svg>
          </i>
      </template>
      <div>
      <div><n-radio :checked="checkedValue == 1" :value="1" @change="handleChange">非会员</n-radio></div>
      <div><n-radio :checked="checkedValue == 2" :value="2" @change="handleChange">VIP1</n-radio></div>
      <div><n-radio :checked="checkedValue == 3" :value="3" @change="handleChange">VIP2</n-radio></div>
      <div><n-radio :checked="checkedValue == 4" :value="4" @change="handleChange">VIP3</n-radio></div>
      <div><n-radio :checked="checkedValue == 5" :value="5" @change="handleChange">VIP4</n-radio></div>
      <div><n-radio :checked="checkedValue == 6" :value="6" @change="handleChange">VIP5</n-radio></div>
      <div><n-radio :checked="checkedValue == 7" :value="7" @change="handleChange">VIP6</n-radio></div>
      
  </div>
  <div class="tibottom">
        <n-button size="tiny" style="margin-right: 10px;">重置</n-button>
        <n-button size="tiny" type="info">确定</n-button>
      </div>
    </n-popover>

          </div> 
        </th>
        <th style="width: 9%;">
          <div class="fovm">
          <span>登录账号数量</span>
          <n-popover
      placement="bottom"
      trigger="click"
      @update:show="handleUpdateShow" 
    >
      <template #trigger>
        <i class="n-base-icon">
            <svg viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <path d="M17,19 C17.5522847,19 18,19.4477153 18,20 C18,20.5522847 17.5522847,21 17,21 L11,21 C10.4477153,21 10,20.5522847 10,20 C10,19.4477153 10.4477153,19 11,19 L17,19 Z M21,13 C21.5522847,13 22,13.4477153 22,14 C22,14.5522847 21.5522847,15 21,15 L7,15 C6.44771525,15 6,14.5522847 6,14 C6,13.4477153 6.44771525,13 7,13 L21,13 Z M24,7 C24.5522847,7 25,7.44771525 25,8 C25,8.55228475 24.5522847,9 24,9 L4,9 C3.44771525,9 3,8.55228475 3,8 C3,7.44771525 3.44771525,7 4,7 L24,7 Z">
</path>
                </g>
              </g>
            </svg>
          </i>
      </template>
      <div>
      <div><n-radio :checked="checkedValue == 1" :value="1" @change="handleChange">升序</n-radio></div>
      <div><n-radio :checked="checkedValue == 2" :value="2" @change="handleChange">降序</n-radio></div>
      
  </div>
  <div class="tibottom">
        <n-button size="tiny" style="margin-right: 10px;">重置</n-button>
        <n-button size="tiny" type="info">确定</n-button>
      </div>
    </n-popover>
          </div>
        </th>
        <th style="width: 8%;">
          <div class="fovm">
            <span>登录状态</span>
            <n-popover
      placement="bottom"
      trigger="click"
      @update:show="handleUpdateShow" 
    >
      <template #trigger>
        <i class="n-base-icon">
            <svg viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <path d="M17,19 C17.5522847,19 18,19.4477153 18,20 C18,20.5522847 17.5522847,21 17,21 L11,21 C10.4477153,21 10,20.5522847 10,20 C10,19.4477153 10.4477153,19 11,19 L17,19 Z M21,13 C21.5522847,13 22,13.4477153 22,14 C22,14.5522847 21.5522847,15 21,15 L7,15 C6.44771525,15 6,14.5522847 6,14 C6,13.4477153 6.44771525,13 7,13 L21,13 Z M24,7 C24.5522847,7 25,7.44771525 25,8 C25,8.55228475 24.5522847,9 24,9 L4,9 C3.44771525,9 3,8.55228475 3,8 C3,7.44771525 3.44771525,7 4,7 L24,7 Z">
</path>
                </g>
              </g>
            </svg>
          </i>
      </template>
      <div>
      <div><n-radio :checked="checkedValue == 1" :value="1" @change="handleChange">登录</n-radio></div>
      <div><n-radio :checked="checkedValue == 2" :value="2" @change="handleChange">未登录</n-radio></div>
      
  </div>
  <div class="tibottom">
        <n-button size="tiny" style="margin-right: 10px;">重置</n-button>
        <n-button size="tiny" type="info">确定</n-button>
      </div>
    </n-popover>
          </div>
          
        </th>
        <th style="width: 7%;">到期时间</th>
        <th style="width: 7%;">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in datalist" :key="index">
        <td>{{item.nickName}}</td>
        <td>{{item.userName}}</td>
        <td>{{item.loginDate}}</td>
        <td>{{item.createTime}}</td>
        <td>{{item.passwordOriginal==null?'':item.passwordOriginal}}</td>
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
  <div class="totlnum">
    <n-pagination v-model:page="pageing" :page-count="Math.floor(total/10)" :on-update:page="onPageChange"/>
    <span style="padding-right: 10px;">共
      <span style="padding: 0 5px;">{{total}}</span>
      条</span>
    
  </div>
  
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
const valueing = ref(null);
const formdata = ref({});
const forpassword = ref();//密码
const datainged = ref();//到期时间
const message = useMessage();
const checkedValue = ref(null);
const pageing = ref(1);
const valuename = ref({
  userName:'',
});
const handleChange = (e)=>{
  checkedValue.value = e.target._value;
  console.log(e.target._value);
}

const pageData = {
  pageNum:1,
  pageSize:10,
}

    let data = {};
    
    listVIP(pageData,data).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
    VIPnum({}).then(res=>{
        datanum.value = res.data;
    })
   const handlePositiveClick =(id)=> {
    
    VIPdelete(id).then(res=>{
      datalist.value = [];
      pageing.value = 1;
          listVIP(pageData,valuename.value).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
      message.success('删除成功')
    })
       
      }
      const handleUpdateShow = ()=> {
       
      }
      const onPageChange  = (page:number)=>{
        console.log(page)
        pageing.value = page;
        datalist.value = [];
        pageData.pageNum = page;
          listVIP(pageData,{}).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
        
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
          pageing.value = 1;
          listVIP(pageData,valuename.value).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
        })
      }
      const getName = ()=>{
          message.success('查询成功');
          datalist.value = [];

          listVIP(pageData,valuename.value).then(res=>{
        datalist.value = res.data.rows;
        total.value = res.data.total;
    })
        
      }
      
</script>
<style lang="less" scoped>
.n-base-icon {
    height: 1em;
    width: 1em;
    line-height: 1em;
    text-align: center;
    position: relative;
    color: rgb(208, 208, 211);
    transform: translateZ(0);
    cursor: pointer;
    font-size: 15px;
    padding-top: 1px;
}
.n-base-icon svg {
    height: 1em;
    width: 1em;
    fill: currentColor;
}
.tibottom{
margin-top: 10px;
display: flex;
justify-content: space-between;
}
.n-radio{
  padding-bottom: 10px;
}
.fovm{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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
    height: 50px; 
}
.textone{
    font-size: 20px;
    
}
.totlnum{
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  padding-top: 20px;
}
.texttwo{
    font-size: 18px;
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