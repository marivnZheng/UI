<template>
    <div class="view-account">
      <div class="view-account-header"></div>
      <div class="view-account-container">
        <div class="view-account-top">
          <div class="view-account-top-logo"
               style="align-items: center;display: flex;margin-bottom: 10px">
               <img :src="websiteConfig.loginImage"
               style="margin-right:12px;width: 44px;height: 44px"
               alt="" />
               <span style="font-size: 28px;">九龙Telegram系统</span>
  
          </div>
          <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
        </div>
        <div class="view-account-form">
          <n-form ref="formRef"
                  label-placement="left"
                  size="large"
                  :model="formInline"
                  :rules="rules">
            <n-form-item path="username">
              <n-input v-model:value="formInline.username"
                       placeholder="请输入用户名">
                <template #prefix>
                  <n-icon size="18"
                          color="#808695">
                    <PersonOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password">
              <n-input v-model:value="formInline.password"
                       type="password"
                       @keydown.enter.prevent
                       showPasswordOn="click"
                       placeholder="请输入密码">
                <template #prefix>
                  <n-icon size="18"
                          color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="aginpassword"
    >
      <n-input
        v-model:value="formInline.aginpassword"
        type="password"
        showPasswordOn="click"
        @keydown.enter.prevent
        placeholder="请重复密码"
      >
      <template #prefix>
                  <n-icon size="18"
                          color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>     
    </n-form-item>

            <n-form-item path="email">
              <n-input v-model:value="formInline.email"
                       placeholder="请输入邮箱">
                <template #prefix>
                  <n-icon size="18"
                          color="#808695">
                    <PersonOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <!--
            <n-form-item path="username">
              <n-input v-model:value="formInline.codeing"
                       placeholder="请输入验证码">
                <template #prefix>
                  <n-icon size="18"
                          color="#808695">
                    <PersonOutline />
                  </n-icon>
                </template>
              </n-input>
              <div @click="getEamil" class="timeTes">
                    {{typenum?'发送验证码':timeNum+'s'}}
                </div>
            </n-form-item>
            -->
            

            <n-form-item>
              <n-button type="primary" @click="handleValidateButtonClick"
                        size="large"
                        :loading="loading"
                        block>
                注册
              </n-button>
            </n-form-item>
            <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>客服联系方式：</span>
              </div>
              <div class="flex-initial mx-2" @click="gokefuen">
                
                <img :src="websiteConfig.kefulogo"
               style="margin-right:12px;width: 24px;height: 24px"
               alt="" />
                <!-- <a href="javascript:">
                  <n-icon size="24"
                          color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a> -->
              </div>
              
              
            </div>
          </n-form-item>

          </n-form>
        </div>
      </div>
      
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref,onUnmounted  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { SendMall,register } from '@/api/system/user';
  import { useMessage,FormInst, FormRules } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import { LockClosedOutline, LogoFacebook, LogoGithub, PersonOutline } from '@vicons/ionicons5';
  import { PageEnum } from '@/enums/pageEnum';
  import { websiteConfig } from '@/config/website.config';
  
  interface FormState {
    username: string;
    password: string;
  }
  const timeNum = ref(60);
  const timer = ref(null);
  const typenum = ref(true);
  const rPasswordFormItemRef = ref(null);
  const formRef = ref(null);
  const message = useMessage();
  const loading = ref(false);
  const autoLogin = ref(true);
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;
  //打开客服页面 
  const gokefuen = ()=>{
  const url = 'https://t.me/jlkf9999';
      window.open(url, '_blank');
}

  //发送验证码校验
const getEamil = ()=>{
  if(typenum.value){
    const emailPattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(emailPattern.test(formInline.email)){
      let data = {
        email:formInline.email
      };
      SendMall(data).then(res=>{
        console.log(res);
      })


      typenum.value = false;
    timer.value =  setInterval(()=>{
        if(timeNum.value>0){
            timeNum.value--;
        }else{
            clearInterval(timer.value);
            typenum.value = true;
        }
    },1000)
    }else{
      message.error('请输入有效邮箱！')
    }
  }
  

    
}
  //注册
  
 function handleValidateButtonClick(e: MouseEvent) {

        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            if(formInline.password != formInline.aginpassword){
              message.error('请确认密码一致！')
            }else{
              if(typenum.value){
                const emailPattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if(emailPattern.test(formInline.email)){
                  let data = {
                username:formInline.username,
                password:formInline.password,
                email:formInline.email
              }
              
              register(data).then(res=>{
                router.push({path:'/'})
              })
    }else{
      message.error('请输入有效邮箱！')
    }
              }

              
              
            }
          }
          
         
        })
      }


  const formInline = reactive({
    username: '',
    password: '',
    aginpassword:'',
    email:'',
    codeing:'',
    isCaptcha: true,
  });
  
  const rules = {
    username: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    aginpassword:{ required: true, message: '请再次输入密码', trigger: 'blur' },
    email: {
    required: true,
    message: '请输入邮箱地址',
    trigger: 'blur'
  },
     
  };
  
  
  const userStore = useUserStore();
  
  const router = useRouter();
  const route = useRoute();

  
  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { username, password } = formInline;
        message.loading('登录中...');
        loading.value = true;
  
        const params: FormState = {
          username,
          password,
        };
  
        try {
          const { code, message: msg } = await userStore.login(params);
          message.destroyAll();
          if (code == ResultEnum.SUCCESS) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
            message.success('登录成功，即将进入系统');
            if (route.name === LOGIN_NAME) {
              router.replace('/');
            } else router.replace(toPath);
          } else {
            message.info(msg || '登录失败');
          }
        } finally {
          loading.value = false;
        }
      } else {
        message.error('请填写完整信息，并且进行验证码校验');
      }
    });
  };

  
  </script>
  
  <style lang="less" scoped>
  .timeTes{
    width: 150px;
    text-align: center;
    border: 1px solid #e5e7eb;
    margin-left: 5px;
    padding: 8px;
    border-radius: 3px;
    cursor: pointer;
  }
  .timeTes:hover{
    border: 1px solid #2D8CF0;
    color: #2D8CF0;
  }
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
  
    &-container {
      flex: 1;
      padding: 32px 12px;
      max-width: 384px;
      min-width: 320px;
      margin: 0 auto;
    }
  
    &-top {
      padding: 32px 0;
      text-align: center;
  
      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }
  
    &-other {
      width: 100%;
    }
  
    .default-color {
      color: #515a6e;
  
      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }
  
  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }
  
    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
  </style>
  