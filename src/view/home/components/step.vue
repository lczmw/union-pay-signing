<template>
  <div :class="footerHS?'fixedFooter':''">
    <div class="stepThree mt10">

      <van-cell-group>
        <van-field
          right-icon="arrow"
          v-model="needOpenPospalAccounts.join(',')"
          label="门店账号"
          type="textarea"
          placeholder="请选择门店账号(可多选)"
          readonly
          rows="1"
          autosize
          :error="accountError.account"
          @focus="onFocus('account')"
          @click.native="popShow1 = true"
        />
        <van-field
          v-model="feeRate"
          label="费率"
          placeholder="0.25至0.6之间"
          autosize
          type="number"
          :error="accountError.account"
          @focus="onFocus('account')"
        />
        <van-field
          v-model="field3.join(',')"
          label="产品类型"
          placeholder="请选择产品类型(可多选)"
          right-icon="arrow"
          readonly
          @click.native="popShow2 = true"
        />
        <van-field
          v-show="isField4Show"
          v-model="field4"
          label="应用场景"
          placeholder="请选择应用场景"
          right-icon="arrow"
          readonly
          @click.native="popShow3 = true"
        />
        <van-field
          v-show="isField5Show"
          v-model="field5"
          label="appid"
          placeholder="请填写(选填)"
          autosize
        />
      </van-cell-group>
    </div>
    <footer :style="footerHS?'':'position:relative'">
      <van-button
        type="primary"
        size="large"
        @click="nextPage"
      >下一步</van-button>
    </footer>

    <van-popup
      v-model="popShow1"
      position="bottom"
    >
      <div class="popup-inner">
        <van-checkbox-group v-model="needOpenPospalAccounts">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in accountList"
              clickable
              :key="item"
              :title="item"
              @click="toggle('checkboxes1')(index)"
            >
              <van-checkbox
                :name="item"
                ref="checkboxes1"
              />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>

    <van-popup
      v-model="popShow2"
      position="bottom"
    >
      <div class="popup-inner">
        <van-checkbox-group v-model="field3">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in columns1"
              clickable
              :key="item"
              :title="item"
              @click="toggle('checkboxes2')(index)"
            >
              <van-checkbox
                :name="item"
                ref="checkboxes2"
              />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>

    </van-popup>

    <van-popup
      v-model="popShow3"
      position="bottom"
    >
      <van-picker
        :columns="columns2"
        show-toolbar
        @confirm="onPickerConfirm2"
        @cancel="popShow3 = false"
      />
    </van-popup>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import Area from '@/components/Area';
import Upload from '@/components/Upload';
import { setBasicInfo } from '@/api';
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
        type: 2,
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
      needOpenPospalAccounts: [],
      feeRate: '',
      popShow1: false,
      popShow2: false,
      popShow3: false,
      accountList: [],
      field3: [],
      field4: '',
      field5: '',
      columns1: ['B扫C', 'C扫B'],
      columns2: ['收银机', '公众号支付', '小程序支付']
    };
  },
  computed: {
    isField4Show() {
      return this.field3.includes('C扫B');
    },
    isField5Show() {
      return (
        this.field3.includes('C扫B') &&
        ['公众号支付', '小程序支付'].includes(this.field4)
      );
    }
  },
  methods: {
    onChange() {},
    onPickerConfirm1(data) {
      this.field3 = data;
      this.popShow2 = false;
    },
    onPickerConfirm2(data) {
      this.field4 = data;
      this.popShow3 = false;
    },
    toggle(name) {
      return index => {
        this.$refs[name][index].toggle();
      };
    },
    handleAccountClick() {
      this.accountPopShow = true;
    },
    init() {
      this.initPageData();
    },
    showAreaFun() {
      this.showArea = true;
    },
    hideArea() {
      this.showArea = false;
    },
    onRead(file) {
      console.log(file);
    },
    confirmArea(data) {
      this.showArea = false;
      this.accountName.country = data[2].code;
      this.accountName.addr = data[0].name + data[1].name + data[2].name;
    },
    goBack() {
      this.$emit('goBack');
    },
    getParams() {
      let csbType = this.columns2.indexOf(this.field4);

      let params = {
        product_bsc: this.field3.includes('B扫C') ? 1 : 0,
        product_csb: this.field3.includes('C扫B') ? 1 : 0,
        sign_id: Cookies.get('sign_id'),
        fee_rate: this.feeRate,
        need_open_pospal_accounts: this.needOpenPospalAccounts.join(','),
        product_csb_type: csbType === -1 ? '' : csbType,
        product_csb_remark: this.field5,
        productType: this.field3
      };

      return params;
    },
    nextPage() {
      let params = this.getParams();

      let validField = {
        need_open_pospal_accounts: '请填写门店账号',
        fee_rate: '请填写费率',
        productType: '请选择产品类型'
      };

      if (this.field3.includes('C扫B')) {
        validField['product_csb_type'] = '请选择应用场景';
      }

      this.globalMixin_validFormEmpty(validField, params)
        .then(() => {
          if (this.feeRate < 0.25) {
            this.$toast({
              message: '费率不能低于0.25',
              duration: 2000
            });
            return;
          }
          if (this.feeRate > 0.6) {
            this.$toast({
              message: '费率不能高于0.6',
              duration: 2000
            });
            return;
          }
          delete params.productType;
          setBasicInfo(params)
            .then(({ result }) => {
              this.globalMixin_updateSigning(result);
              this.$emit('nextPage');
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    onFocus(key) {
      // this.realError[key] = false
      // this.detailFocused = key === 'addressDetail';
      // this.$emit('focus', key);
    },
    initPageData() {
      this.field3 = [];
      let {
        fee_rate,
        need_open_pospal_accounts = '',
        all_pospal_accounts,
        product_bsc,
        product_csb,
        product_csb_type,
        product_csb_remark
      } = this.globalMixin_getSigning();
      this.needOpenPospalAccounts =
        need_open_pospal_accounts === ''
          ? []
          : need_open_pospal_accounts.split(',');
      this.feeRate = fee_rate || '';
      this.accountList = all_pospal_accounts;

      if (product_bsc === 1) {
        this.field3.push('B扫C');
      }
      if (product_csb === 1) {
        this.field3.push('C扫B');
      }
      if (product_csb_type !== undefined) {
        this.field4 = this.columns2[product_csb_type];
      }
      if (product_csb_remark !== undefined) {
        this.field5 = product_csb_remark;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import '../../../assect/style/var.less';
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
.popup-inner {
  max-height: 300px;
}
</style>