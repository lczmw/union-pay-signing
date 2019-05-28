<template>
  <div :class="footerHS?'fixedFooter':''">
    <div class="stepThree">
      <div class="tab">
        <div class="tabTitle">账户类型</div>
        <div
          :class="accountName.type == 1?'tabBtn on':'tabBtn'"
          @click="threeDisabled?'':accountName.type = 1"
        >个人账户</div>
        <div
          :class="accountName.type == 2?'tabBtn on':'tabBtn'"
          @click="threeDisabled?'':accountName.type = 2"
        >公司账户</div>
      </div>
      <ul class="home-tip">
        <li v-if="accountName.type == 1">
          <span class="dot">●</span>个人账户认证：根据姓名、身份证号、银行卡号三要素和银行开户信息匹配一致则认为为本人。
        </li>
        <li v-else>
          <span class="dot">●</span>公司账户认证：认证平台将随机向您所提供的账户内实时汇入一笔微小额资金，请通过日常财务查账途径，正确填写实时收到的入账资金，比对一致则认为为开户企业或单位本身在申请开通业务。
        </li>
      </ul>
      <van-cell-group>
        <van-field
          v-if="accountName.type == 2"
          v-model="accountName.openName"
          label="开户名称"
          placeholder="对外经营名称或招牌名称"
          :disabled="threeDisabled"
          :error="accountError.name"
          @focus="onFocus('name')"
        />
        <van-field
          v-model="accountName.name"
          label="银行账号"
          placeholder="请输入与“开户名称”同名的银行账号"
          type="number"
          :disabled="threeDisabled"
          :error="accountError.name"
          @focus="onFocus('name')"
        />

        <van-field
          v-model="accountName.addr"
          label="开户所在地"
          placeholder="请选择"
          right-icon="arrow"
          :disabled="threeDisabled"
          readonly
          @click="showAreaFun"
        />
        <van-field
          v-model="accountName.branchName"
          center
          clearable
          label="所属支行"
          placeholder="请输入关键字"
          :disabled="threeDisabled"
          :error="accountError.code"
          @focus="onFocus('tel')"
        >
          <van-button
            :disabled="threeDisabled"
            slot="button"
            size="small"
            type="primary"
            @click="queryBranchBank"
          >搜索</van-button>
        </van-field>
      </van-cell-group>

      <ul v-if="accountName.type == 1" class="home-tip fz12">
        <li>
          <span class="dot">●</span>个人账户认证：根据姓名、身份证号、银行卡号三要素和银行开户信息匹配一致则认为为本人。
        </li>
        <li>
          <span class="dot">●</span>多关键词查询以“/”符号分隔，需要遵从前后顺序对应规则，如“招商/东方”
        </li>
      </ul>
      <ul v-else class="home-tip fz12">
        <li>
          <span class="dot">●</span>通过搜索有效关键字快速定位支行信息，如“中国招商银行上海东方支行”，通过“东方”有效关键字快速定位支行。
        </li>
        <li>
          <span class="dot">●</span>多关键词查询以“/”符号分隔，需要遵从前后顺序对应规则，如“招商/东方”
        </li>
      </ul>

      <section v-show="accountName.type == 1" class="home-upload">
        <div class="home-upload-txt">
          法人手持身份证自拍照
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="threeDisabled" type="4" document-type="0007" not-uploaded-tip="请上传手持身份证自拍照" ref="upload0"/>
        </div>
      </section>
      <section v-show="accountName.type == 2" class="home-upload">
        <div class="home-upload-txt">
          开户许可证
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="threeDisabled" document-type="0006" not-uploaded-tip="请上传开户许可证" ref="upload1"/>
        </div>
      </section>
     <!--  <ul v-show="accountName.type == 2" class="home-tip">
        <li>
          <span class="dot">●</span>我们将在您的对公账户打一笔随机金额和验证码用于验证
        </li>
      </ul>

      <div v-show="accountName.type == 2" class="tab auth" @click="showAuth">
        <div class="tabTitle">对公账户认证</div>
        <div class="fr">
          去认证
          <van-icon name="arrow"/>
        </div>
      </div> -->
      <van-popup v-model="showArea" position="bottom">
        <Area
          :areaValue="accountName.country"
          :num="2"
          @hideArea="hideArea"
          @confirmArea="confirmArea"
        />
      </van-popup>
      <van-popup v-model="showBank" position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="showBank=false" @confirm="onConfirm"/>
      </van-popup>
    </div>
    <footer :style="footerHS?'':'position:relative'">
      <div class="doubleBtn">
        <van-button type="warning" size="large" @click="goBack">上一步</van-button>
        <van-button type="primary" size="large" @click="nextPage">下一步</van-button>
      </div>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { queryBranchBank, setBankInfo } from '@/api'
import { getStore } from '@/utils'
import Area from '@/components/Area'
import Upload from '@/components/Upload'
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
      threeDisabled: false,
      accountName: {
        type: 1,
        account: '',
        addr: '',
        bank: '',
        idCard: '',
        province: '',
        city: '',
        country: '',
        branchName: '',
        branchCode: '',
        openName: '',
        name: '',
      },
      accountError: {
        type: false,
        account: false,
        addr: false,
        bank: false
      },
      showBank: false,
      city: null,
      columns: [
        // { text: '杭州', id: '1' },
        // { text: '宁波', id: '2' },
        // { text: '温州', id: '3' }
      ]
    }
  },
  methods: {
    queryBranchBank() {
      if (this.city === null) {
        this.$toast({
          message: '请选择开户所在地',
          duration: 2000
        });
        return
      }
      if (this.accountName.branchName === '') {
        this.$toast({
          message: '请输入所属支行关键字',
          duration: 2000
        });
        return
      }
      queryBranchBank({
        cityId: this.city.code,
        key: this.accountName.branchName
      }).then(res => {
        this.showBank = true
        this.columns = []
        res.result.branchBankList.map(item => {
          this.columns.push({
            text: item.bankBranchName, id: item.code
          })
        })
      })
    },
    onConfirm({ id, text }) {
      this.showBank = false
      this.accountName.branchName = text
      this.accountName.branchCode = id
  
    },
    init() {
      let signing = getStore('pospal_signing', true);
      this.signing = signing;
      if (signing.sign_step === 4) {
        this.accountName.type = 2;
        this.showAuth();
      }
  
    },
    confirmArea(data) {
      
      this.city = data[1]
      this.accountName.addr = `${data[0].name} ${data[1].name}`
      this.showArea = false
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
    showAuth() {
      this.$emit('showAuth')
    },
    goBack() {
      this.$emit('goBack')
    },
    getParams() {
      let params = {
        'sign_id': Cookies.get('sign_id'),
        'bank_acct_type': ''+(this.accountName.type - 1),
        'bank_acct_no': this.accountName.name,
        'bank_branch_name': this.accountName.branchName,
        'bank_no': this.accountName.branchCode,
        'bank_acct_name': this.accountName.type === 2 ? this.accountName.openName : this.signing.legal_name
      }

      return params
    },
    onFocus() {

    },
    isImagesListUploaded() {
      let uploadIndexList = this.accountName.type == 1 ? ['0'] : ['1'];
      let notUploaded = uploadIndexList.some((item, index) => {
        return this.$refs[`upload${ item }`].hasUploaded() === false;
      })
      return !notUploaded;
    },
    nextPage() {

      let params = this.getParams()
      let validField = {
        'bank_acct_no': '请填写银行账号',
        'bank_no': '请选择所属支行',
        'bank_acct_name': '请填写开户名称',
      }
      this.globalMixin_validFormEmpty(validField, params)
      .then(() => {

        if (!this.isImagesListUploaded()) {
          return
        }
        setBankInfo(params)
        .then(({ result }) => {
            this.globalMixin_updateSigning(result)
           if (result.sign_step === 4) {
            this.showAuth();
           } else if (result.sign_step === 5) {} {
             window.location = result.h5_agreement_sign_url
              this.$emit('nextPage')
           }
        })
        .catch(() => {})
      })
      .catch(() => {

      })
    },
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
<style lang="less">
.stepThree {
  .van-field__label {
    max-width: 90px;
  }
}
</style>
