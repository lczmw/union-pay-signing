<template>
  <div class="auth-wrapper">
    <header ref="header">
      <van-nav-bar title="对公账户认证" left-arrow @click-left="hideAuth"/>
    </header>
    <van-cell-group>
      <van-field v-model="transAmt" label="入账金额" placeholder="请输入金额（单位：分）"/>
      <van-field v-model="verifyCode" label="备注验证码" placeholder="银行入账交易备注的6位验证码" type="number"/>
    </van-cell-group>
    <ul class="home-tip">
      <li>
        <span class="dot">●</span>我们将在您的对公账户打一比随机金额和验证码用于验证
      </li>
    </ul>
    <footer>
      <van-button type="primary" size="large" @click="clickSure">确定</van-button>
    </footer>
  </div>
</template>

<script>
import { companyAccountVerify } from '@/api'
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
    };
  },
  mounted() {
  },
  methods: {
    onNavClick(index) {
      this.mainActiveIndex = index;
    },
    onItemClick(data) {
      this.activeId = data.id;
    },
    getParams() {
      let params = {
        'sign_id': this.signId,
        'trans_amt': this.transAmt,
        'verify_code': this.verifyCode,
      }
      return params
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
        .then((res) => {
            this.hideAuth();
            this.$emit('on-success', res)
        })
        .catch(() => {})
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