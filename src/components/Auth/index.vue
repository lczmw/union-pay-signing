<template>
  <div class="auth-wrapper">
    <header ref="header">
      <van-nav-bar title="对公账户认证" left-arrow @click-left="hideAuth"/>
    </header>
    <van-cell-group>
      <van-field v-model="transAmt" label="入账金额" placeholder="请输入金额（单位：分）"/>
      <van-field v-model="verifyCode" label="备注验证码" placeholder="银行入账交易备注的6位验证码" type="number"/>
    </van-cell-group>
    <ul class="home-tip" style="margin-bottom: 20px">
      <li>
        <span class="dot">●</span>我们将在您的对公账户打一比随机金额和验证码用于验证
      </li>
    </ul>
    <footer>
      <van-button type="primary" size="large" @click="clickSure" style="margin-bottom: 20px">确定</van-button>
      <van-button type="primary" size="large" @click="clickVer" v-show="isVerShow">重新打款验证</van-button>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { companyAccountVerify, RequestAccountVerify } from '@/api'
export default {
  data() {
    return {
      showArea: false,
      transAmt: '',
      verifyCode: '',
      accountName: {
        type: 1,
        account: '',
        addr: '',
        bank: '',
        idCard: '',
        province: '',
        city: '',
        country: ''
      },
      accountError: {
        type: false,
        account: false,
        addr: false,
        bank: false
      },
      isVerShow: false
    };
  },
  mounted() {
  },
  methods: {
    init() {
      this.initPageData();
    },
    initPageData() {

       let { trans_amt, verify_code } = this.globalMixin_getSigning()
        this.transAmt = trans_amt || '';
        this.verifyCode =  verify_code || '';
    },
    onNavClick(index) {
      this.mainActiveIndex = index;
    },
    onItemClick(data) {
      this.activeId = data.id;
    },
    getParams() {
      let params = {
        'sign_id': Cookies.get('sign_id'),
        'trans_amt': this.transAmt,
        'verify_code': this.verifyCode,
      }
      return params
    },
    clickVer() {
      RequestAccountVerify({
        'sign_id': Cookies.get('sign_id')
      })
      .then(() => {
        this.$toast({
            message: '重新打款成功',
            duration: 2000
        })
        this.isVerShow = false
      })
      .catch(() => {

      })
    },
    clickSure() {
      let params = this.getParams()
      let validField = {
        'trans_amt': '请输入入账金额',
        'verify_code': '请输入备注验证码',
      }
      this.globalMixin_validFormEmpty(validField, params)
      .then(() => {

        companyAccountVerify(params)
        .then(({ result }) => {
            this.hideAuth();
            this.$emit('on-success', result)
        })
        .catch(() => {
          this.isVerShow = true
        })
      })
      .catch(() => {

      })
    },
    hideAuth() {
      this.$emit('hideAuth')     
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assect/style/var.less";
.auth-wrapper {
  position: relative;
  height: 100vh;
  padding-top: 40px;
  box-sizing: border-box;
  overflow: hidden;
  header {
    position: fixed;
    width: 100%;
    top: 0px;
    left: 0px;
    z-index: 2;
  }
  footer {
    padding: 0 10px;
    .van-button--large {
      height: 42px;
      line-height: 40px;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>