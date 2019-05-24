<template>
  <div>
    <div v-show="!showAgree&&!showIndustry&&!showAuth" :class="active==5?'home-wrapper white':'home-wrapper'">
      <header>
        <van-nav-bar title="商户自助签约" :left-arrow="active!=0" @click-left="goBack"/>
      </header>
      <van-steps :active="active" active-color="#1A76E0">
        <!-- <van-step>银豹账号</van-step> -->
        <van-step>
          银豹
          <br>信息
        </van-step>
        <van-step>
          实名
          <br>认证
        </van-step>
        <van-step>
          营业
          <br>信息
        </van-step>
        <van-step>
          账户
          <br>信息
        </van-step>
        <van-step>
          签订
          <br>协议
        </van-step>
        <van-step>
          资质
          <br>审核
        </van-step>
      </van-steps>

      <div v-show="active==0" class="step0">
        <step ref="step0" :footerHS="footerHS" @nextPage="nextPage"></step>
      </div>
      <div v-show="active==1" class="step1">
        <step-one
          ref="step1"
          :footerHS="footerHS"
          @showAgree="showAgree=true"
          @nextPage="nextPage"
          @goBack="goBack"
        ></step-one>
      </div>
      <div v-show="active==2" class="step2 mt10">
        <step-two
          ref="step2"
          :footerHS="footerHS"
          @showIndustry="showIndustry=true"
          @nextPage="nextPage"
          @goBack="goBack"
          :industry-id="industryId"
          :industry-text="industryText"
        ></step-two>
      </div>

      <div v-show="active==3" class="step3 mt10">
        <step-three
          ref="step3" :footerHS="footerHS"
          @showAuth="showAuth=true" @nextPage="nextPage" @goBack="goBack"></step-three>
      </div>
      <div v-show="active==4">
        <footer>
          <van-button type="warning" size="large" @click="goBack">上一步</van-button>
          <van-button type="primary" size="large" @click="nextPage">下一步</van-button>
        </footer>
      </div>
      <div v-show="active==5" class="step5 mt10">
        <step-five
          ref="step5" @nextPage="nextPage"></step-five>
      </div>
      <!-- <footer :style="hidshow?'':'position:relative'">
        <div v-if="active==0">
          <van-button type="primary" size="large" @click="saveRealName">下一步</van-button>
        </div>
        <div class="doubleBtn" v-if="active==1">
          <van-button type="warning" size="large" @click="goBack">上一步</van-button>
          <van-button type="primary" size="large" @click="saveRealName">下一步</van-button>
        </div>
      </footer>-->
    </div>
    <Agreement v-show="showAgree" @hideAgree="showAgree=false"></Agreement>
    <Industry v-show="showIndustry" @hideIndustry="hideIndustry"></Industry>
    <Auth v-show="showAuth" @hideAuth="hideAuth" @on-success="onAuthSuccess"></Auth>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Agreement from '@/components/Agreement'
import Industry from '@/components/Industry'
import Auth from '@/components/Auth'
import { isMobile } from '@/utils/validate'
import { setStore, removeStore } from '@/utils'
import step from './components/step'
import stepOne from './components/stepOne'
import stepTwo from './components/stepTwo'
import stepThree from './components/stepThree'
import stepFive from './components/stepFive'
import { verifyPospalAccount } from '@/api'
export default {
  components: {
    Agreement,
    Industry,
    Auth,
    stepOne,
    stepTwo,
    stepThree,
    stepFive,
    step
  },
  data() {
    return {
      // 键盘问题，
      docmHeight: '0',  //默认屏幕高度
      showHeight: '0',  //实时屏幕高度
      footerHS: true,  //显示或者隐藏footer,
      isResize: false, //默认屏幕高度是否已获取
      active: 0,
      showAgree: false,
      showIndustry: false,
      showBusinessType: false,
      showArea: false,
      showAuth: false,
      industryId: '',
      industryText: '',
    }
  },
  mounted() {
   
    
    this.docmHeight = document.documentElement.clientHeight
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight
      })()
    }
  },
  watch: {
    showHeight() {
      if (this.docmHeight > this.showHeight) {
        this.footerHS = false
      } else {
        this.footerHS = true
      }
    },
    active() {
      this.init()
      console.log(this.active)
    }
  },
  methods: {
    
    verifyPospalAccount() {
      verifyPospalAccount(
        { pospal_account: Cookies.get('account')},
        { isShowError: false }
      ).then(({ result }) => {

        let step = result.signing.sign_step > 3 ? result.signing.sign_step - 1 : result.signing.sign_step;
        this.active =  step || 0
        setStore('pospal_signing', result.signing)
        this.init(result.signing)
      })
      .catch(() => {
          removeStore('pospal_signing')
          this.$router.replace('/')
      })
    },
    init(signing) {

      this.$nextTick(function() {
        
        if(this.active == 0){
          this.$refs.step0.init()
        }else if(this.active == 1){
          this.$refs.step1.init()
        }else if(this.active == 2){
          this.$refs.step2.init()
        }else if(this.active == 3){
          this.$refs.step3.init()
        }else if(this.active == 4){
          window.location = signing.h5_agreement_sign_url
        }else if (this.active == 5) {
          this.$refs.step5.init()
        }
      })
    },
    onConfirm(value, index) {
      this.showBusinessType = false
      this.$toast(`当前值：${value}, 当前索引：${index}`);
      this.businessInfo.type = value
    },
    showAgreeFun() {
      this.showAgree = true
    },
    showAuthFun() {
      this.showAuth = true
    },
    onFocus(key) {
      this.realError[key] = false
      // this.detailFocused = key === 'addressDetail';
      // this.$emit('focus', key);
    },
    getRealError(key) {
      const value = String(this.realName[key] || '').trim();
      // if (this.validator) {
      //   const message = this.validator(key, value);
      //   if (message) {
      //     return message;
      //   }
      // }
      switch (key) {
        case 'name':
          return value ? '' : '姓名不为空';
        case 'tel':
          return isMobile(value) ? '' : '手机号码不正确';
        case 'code':
          return value ? '' : '验证码不为空';
        case 'email':
          return value ? '' : '邮箱不为空';
        case 'idCard':
          return value ? '' : '身份证号不为空';
        // return value && !/^\d{6}$/.test(value) ? t('postalEmpty') : '';
      }
    },
    hideIndustry(activeId = '', activeText = '') {
      this.showIndustry = false;
      this.industryId = activeId;
      this.industryText = activeText;
      // this.$toast(activeId)
    },
    hideAuth() {
      this.showAuth = false;
    },
    onAuthSuccess(res) {
      console.log(res)
    },
    nextPage() {
      // this.docmHeight = document.documentElement.clientHeight
      this.active++
    },
    goBack() {
      // this.docmHeight = document.documentElement.clientHeight
      this.active--;
    },
    onClickLeft() {
      // Toast('返回');
    },
    onRead(file) {
      console.log(file)
    },
  },
  created() {
    this.verifyPospalAccount()
  },
}
</script>

<style lang="less">
@import "../../assect/style/var.less";
.doubleField {
  .van-cell {
    padding-right: 0px;
    &.noPL {
      padding-left: 0px;
    }
  }
  .endTip {
    font-size: 15px;
    line-height: 44px;
    color: @MainText;
  }
}
.home-wrapper {
  position: relative;
  padding-bottom: 70px;
  padding-top: 46px;
  height: 100vh;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
  &.white {
    background: #fff;
  }
  header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 2;
  }

  .home-upload {
    background: @White;
    margin-top: 10px;
    &-txt {
      font-size: 15px;
      padding: 10px;
      background: #ffffff;
      border-bottom: 1px solid @Line;
      span {
        font-size: 12px;
      }
    }
    &-content {
      position: relative;
      padding: 10px;
      font-size: 0px;
      &-item {
        width: 31%;
        height: 2.8rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .home-upload-content-item + .home-upload-content-item {
        margin-left: 10px;
      }
    }
  }
  .home-agree {
    background: @White;
    color: @RegularText;
    font-size: 13px;
    padding: 10px;
    margin-top: 10px;
  }

  footer {
    position: fixed;
    width: 100%;
    padding: 10px;
    background: @White;
    bottom: 0;
    left: 0;
    font-size: 0px;
    box-sizing: border-box;
  }
}
</style>