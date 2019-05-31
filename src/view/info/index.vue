<template>
  <div class="info-wrapper">
    <header>
      <van-nav-bar title="商户自助签约" :left-arrow="canBack" @click-left="onClickLeft"/>
    </header>
    <section>
      <van-cell-group>
        <van-field
          v-model="account"
          label="银豹账号"
          placeholder="请输入银豹账号"
          :error="errorAccount"
          @focus="onFocus"
        />
      </van-cell-group>

      <ul class="home-tip">
        <li>
          <span class="dot">●</span>请输入您所开通的银豹账号，方便后续填写资料
        </li>
      </ul>
    </section>

    <footer>
      <van-button type="primary" size="large" @click="getList">确定</van-button>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { QuerySignRecords } from '@/api'
export default {
  data() {
    return {
      account: '',
      errorAccount: false,
    }
  },
  computed: {
    canBack() {
      return this.$route.query.from === '1'
    }
  },
  mounted() {

  },
  watch: {
  },
  methods: {
    onClickLeft() {
      if (!this.canBack) return
        this.$router.go(-1);
    },
    getList() {
      // const isValid = items.every(item => {
      //   const msg = this.getErrorMessage(item);
      //   if (msg) {
      //     this.errorInfo[item] = true;
      //     Toast(msg);
      //   }
      //   return !msg;
      // });
      const msg = this.getErrorMessage()
      if (msg) {
        this.errorAccount = true
        this.$toast(msg)
      }
      if (!msg) {
        this.verifyPospalAccount()
      }
    },
    onFocus() {
      this.errorAccount = false
    },
    getErrorMessage() {
      return this.account ? '' : '账号不为空';
    },
    verifyPospalAccount() {
      QuerySignRecords({
        pospal_account: this.account
      }).then(res => {
        
        Cookies.set('account', this.account);
        this.$router.push('/signlist?type=2')
      })
    },
    onFocus() {
      this.errorAccount = false
    },
  }
}
</script>

<style lang="less" scoped>
.info-wrapper {
  position: relative;
  height: 100vh;
  .home-tip {
    padding: 10px 0px;
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