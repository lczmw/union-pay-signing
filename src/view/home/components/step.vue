<template>
  <div :class="footerHS?'fixedFooter':''">
    <div class="stepThree">
      <div class="tab mt10">
        <div class="tabTitle">门店类型</div>
        <div :class="accountName.type == 1?'tabBtn on':'tabBtn'" @click="accountName.type = 1">单门店</div>
        <div :class="accountName.type == 2?'tabBtn on':'tabBtn'" @click="accountName.type = 2">连锁门店</div>
      </div>
      <van-cell-group>
        <van-field
          v-if="accountName.type == 2"
          v-model="needOpenPospalAccounts"
          label="门店账号"
          type="textarea"
          placeholder="多个门店中间用逗号隔开"
          rows="1"
          autosize
          :error="accountError.account"
          @focus="onFocus('account')"
        />
        <van-field
          v-model="feeRate"
          label="费率"
          placeholder="费率"
          autosize
          type="number"
          :error="accountError.account"
          @focus="onFocus('account')"
        />
      </van-cell-group>
    </div>
    <footer :style="footerHS?'':'position:relative'">
      <van-button type="primary" size="large" @click="nextPage">下一步</van-button>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Area from '@/components/Area'
import Upload from '@/components/Upload'
import { setBasicInfo } from '@/api'
export default {
  components: {
    Area,
    Upload
  },
  props: {
    footerHS: true
  },
  data() {
    return {
      showArea: false,
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
      needOpenPospalAccounts: '',
      feeRate: '',
    }
  },
  methods: {
    init() {
      this.initPageData();
    },
    showAreaFun() {
      this.showArea = true
    },
    hideArea() {
      this.showArea = false
    },
    onRead(file) {
      console.log(file)
    },
    confirmArea(data) {
      this.showArea = false
      this.accountName.country = data[2].code
      this.accountName.addr = data[0].name + data[1].name + data[2].name
    },
    goBack() {
      this.$emit('goBack')
    },
    getParams() {
      let params = {
        sign_id: Cookies.get('sign_id'),
        store_type: this.accountName.type,
        fee_rate: this.feeRate,
      }

      if (this.accountName.type === 2) {
        params.need_open_pospal_accounts = this.needOpenPospalAccounts
      }

      return params
    },
    nextPage() {
      let params = this.getParams()

      let validField = {
        'need_open_pospal_accounts': '门店账号不能为空',
        'fee_rate': '费率不能为空'
      }
      this.globalMixin_validFormEmpty(validField, params)
      .then(() => {
        setBasicInfo(params)
        .then(() => {
           this.$emit('nextPage')
        })
        .catch(() => {})
      })
      .catch(() => {

      })
      
     
    },
    onFocus(key) {
      // this.realError[key] = false
      // this.detailFocused = key === 'addressDetail';
      // this.$emit('focus', key);
    },
    initPageData() {
      let { store_type, fee_rate, need_open_pospal_accounts } = this.globalMixin_getSigning()
      this.accountName.type = store_type;
      this.needOpenPospalAccounts = need_open_pospal_accounts;
      this.feeRate = fee_rate
    }
  },
  mounted() {
  
  }
}
</script>

<style lang="less" scoped>
@import "../../../assect/style/var.less";
.fixedFooter {
  padding-bottom: 70px;
}
.tab.auth {
  margin-top: 10px;
  .fr {
    color: @Primary;
    .van-icon {
      vertical-align: middle;
    }
  }
}
</style>