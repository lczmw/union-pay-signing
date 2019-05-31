<template>
  <div :class="footerHS?'fixedFooter':''">
    <div class="stepTwo">
      <van-cell-group class="mt10">
        <van-field
          v-model="businessInfo.type"
          label="营业执照类型"
          placeholder="请选择"
          right-icon="arrow"
          :disabled="twoDisabled"
          readonly
          @click="showBusinessType=true"
        />
        <div v-show="businessInfo.type">
          <van-field
            v-model="businessInfo.name"
            label="营业名称"
            placeholder="请填写营业执照上的商户名称"
            :disabled="twoDisabled"
            :error="businessError.name"
            @focus="onFocus('name')"
          />
          <van-field
            v-model="businessInfo.addr"
            label="营业地址"
            placeholder="请选择"
            right-icon="arrow"
            :disabled="twoDisabled"
            readonly
            @click="showAreaFun"
          />

          <!-- <van-field
              v-model="businessInfo.name"
              label="详细地址"
              placeholder="请输入详细地址"
              :error="realError.name"
              @focus="onFocus('name')"
          />-->
          <van-row class="doubleField">
            <van-col span="14">
              <van-field
                v-model="businessInfo.road"
                label="详细地址"
                placeholder="例:张衡路"
                :disabled="twoDisabled"
                :error="businessError.road"
                @focus="onFocus('name')"
              />
            </van-col>
            <van-col class="endTip" span="3">道/路</van-col>
            <van-col span="4">
              <van-field
                v-model="businessInfo.number"
                placeholder="例:1066"
                :disabled="twoDisabled"
                :error="businessError.number"
                class="noPL"
                @focus="onFocus('name')"
              />
            </van-col>
            <van-col class="endTip" span="3">号/弄</van-col>
          </van-row>

          <van-field
            v-model="businessInfo.moreAddr"
            label="补充地址"
            placeholder="请输入地址剩余说明部分(选填)"
           :disabled="twoDisabled"
            :error="businessError.moreAddr"
            @focus="onFocus('name')"
          />
          <van-field
            v-model="industryText"
            label="所属行业"
            placeholder="请选择"
            right-icon="arrow"
           :disabled="twoDisabled"
            readonly
            @click="showIndustry"
          />

          <van-field
            v-model="businessInfo.code"
            label="社会统一代码"
            placeholder="请输入社会统一代码"
           :disabled="twoDisabled"
            :error="businessError.code"
            @focus="onFocus('name')"
          />
        </div>
      </van-cell-group>
      <section
        class="home-upload"
        v-show="businessInfo.type=='多合一营业执照' || businessInfo.type=='普通营业执照'"
      >
        <div class="home-upload-txt">
          营业执照
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <!-- <van-uploader :after-read="onRead" class="home-upload-content-item">
          <img src="../../../assect/img/add.png" alt>
          </van-uploader>-->
          <Upload :disabled="twoDisabled" document-type="0002" not-uploaded-tip="请上传营业执照" ref="upload0"/>
        </div>
      </section>
      <section class="home-upload" v-show="businessInfo.type=='普通营业执照'">
        <div class="home-upload-txt">
          税务登记证
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="twoDisabled" document-type="0003" not-uploaded-tip="请上传税务登记证" ref="upload1"/>
        </div>
      </section>
      <section class="home-upload" v-show="businessInfo.type=='普通营业执照'">
        <div class="home-upload-txt">
          组织机构代码证
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="twoDisabled" document-type="0004" not-uploaded-tip="请上传组织机构代码证" ref="upload2"/>
        </div>
      </section>
      <section class="home-upload" v-show="businessInfo.type">
        <div class="home-upload-txt">
          营业场所照片
          <span>(图一请上传店外照片，图二请上传店内照片，图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="twoDisabled" document-type="0005" not-uploaded-tip="请上传店外照片" ref="upload3"/>
          <Upload :disabled="twoDisabled" document-type="0015" not-uploaded-tip="请上传店内照片" ref="upload4"/>
        </div>
      </section>
      <section class="home-upload" v-show="businessInfo.type">
        <div class="home-upload-txt">
          辅助证明材料
          <span>(选填，图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload :disabled="twoDisabled" document-type="0008"/>

          <Upload :disabled="twoDisabled" document-type="0013"/>

          <Upload :disabled="twoDisabled" document-type="0014"/>
        </div>
      </section>
      <ul class="home-tip" v-show="businessInfo.type">
        <li>
          <span class="dot">●</span>辅助证明材料: 包括但不限于营业场所租赁协议或者产权证明、集中经营场所管理方出具的证明文件等能够反映小微商户真实、合法从事商品或服务交易活动的材料。
        </li>
        <li>
          <span class="dot">●</span>最多可上传三张图片
        </li>
      </ul>
      <div class="step2-tip" v-show="!businessInfo.type">
        <img class="step2-demo" src="../../../assect/img/demo.png">
        <img class="step2-arrow" src="../../../assect/img/line-arrow.png">
        <p>请选择营业执照类型</p>
      </div>
      <van-popup v-model="showBusinessType" position="bottom">
        <van-picker
          :columns="businessTypeOption"
          :default-index="2"
          show-toolbar
          @confirm="onConfirm"
          @cancel="showBusinessType=false"
        />
      </van-popup>
      <van-popup v-model="showArea" position="bottom">
        <Area :areaValue="businessInfo.country" @hideArea="hideArea" @confirmArea="confirmArea"/>
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
import Area from '@/components/Area'
import Upload from '@/components/Upload'
import { setBusinessInfo } from '@/api'

export default {
  components: {
    Area,
    Upload
  },
  props: {
    footerHS: true,
    industryId: '',
    industryText: '',
  },
  watch: {
    industryId: {
      immediate: true,
      handler(val) {
        this.industryCode = val;
      }
    }
  },
  data() {
    return {
      twoDisabled: false,
      businessInfo: {
        type: null,
        name: '',
        addr: '',
        road: '',
        number: '',
        moreAddr: '',
        industry: '',
        code: '',
        province: '',
        city: '',
        country: '',
        provinceId: '',
        index: ''
      },
      businessError: {
        name: false,
        addr: false,
        road: false,
        number: false,
        moreAddr: false,
        industry: false,
        code: false
      },
      showBusinessType: false,
      businessTypeOption: ['多合一营业执照', '普通营业执照'],
      showArea: false,
      shop: {}
    }
  },
  mounted() {

   
  },
  methods: {
    initPageData() {
      let { license_type, shop_name, shop_province_id, shop_city_id, shop_country_id, shop_road, shop_house_no, shop_addr_ext, mccCode, shop_lic } = this.globalMixin_getSigning()


    this.businessInfo.index = license_type;
    this.businessInfo.type =  ['多合一营业执照', '普通营业执照'][license_type];
    this.businessInfo.name = shop_name;
    this.shop.provinceId = shop_province_id;
    this.shop.cityId = shop_city_id;
    this.shop.countryId = shop_country_id;
    this.businessInfo.road = shop_road;
    this.businessInfo.number = shop_house_no;
    this.businessInfo.moreAddr = shop_addr_ext;
    this.industryCode = mccCode;
    this.businessInfo.code = shop_lic;
    },
    init() {
      this.initPageData();
      this.initUploadStatus();
    },
    onConfirm(value, index) {
   
      this.showBusinessType = false
      // this.$toast(`当前值：${value}, 当前索引：${index}`);
      this.businessInfo.type = value
      this.businessInfo.index = index
    },
    confirmArea(data) {
   
      this.showArea = false
      this.businessInfo.country = data[2].code
      this.businessInfo.addr = data[0].name + data[1].name + data[2].name
      this.businessInfo.provinceId = data[0].code
      this.businessInfo.cityId = data[1].code
      this.businessInfo.countryId = data[2].code

      this.shop = {
        provinceId: data[0].code,
        cityId: data[1].code,
        countryId: data[2].code,
      }
      // console.log(province + city + country)
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
    showIndustry() {
      this.$emit('showIndustry')
    },
    goBack() {
      this.$emit('goBack')
    },
    onFocus() {

    },
    getParams() {
      let params = {
        'sign_id': Cookies.get('sign_id'),
        'license_type': this.businessInfo.index,
        'shop_name': this.businessInfo.name,
        'shop_province_id': this.shop.provinceId,
        'shop_city_id': this.shop.cityId,
        'shop_country_id': this.shop.countryId,
        'shop_road': this.businessInfo.road,
        'shop_house_no': this.businessInfo.number,
        'shop_addr_ext': this.businessInfo.moreAddr,
        'mccCode': this.industryCode,
        'shop_lic': this.businessInfo.code,
      }

      return params
    },
    nextPage() {
      
      let params = this.getParams()
      let validField = {
        'license_type': '请选择营业执照类型',
        'shop_name': '请输入营业名称',
        'shop_province_id': '请选择营业地址',
        'shop_road': '请输入详细地址路名',
        'shop_house_no': '请输入详细地址门牌',
        // 'shop_addr_ext': '请输入补充地址',
        'mccCode': '请选择所属行业',
        'shop_lic': '请输入社会统一代码'
      }
      this.globalMixin_validFormEmpty(validField, params)
      .then(() => {

        if (!this.isImagesListUploaded()) {
          return
        }
        
        setBusinessInfo(params)
        .then(({ result }) => {
          this.globalMixin_updateSigning(result)
           this.$emit('nextPage')
        })
        .catch(() => {})
      })
      .catch(() => {

      })
    },
    isImagesListUploaded() {
      let uploadIndexList = this.businessInfo.type === '多合一营业执照' ? ['0', '3', '4'] : ['0', '1', '2', '3', '4'];
      let notUploaded = uploadIndexList.some((item, index) => {
        return this.$refs[`upload${ item }`].hasUploaded() === false;
      })
      return !notUploaded;
    },
    initUploadStatus() {
      
       ['0', '1', '2', '3', '4'].forEach((item) => {
        this.$refs[`upload${ item }`].init();
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import "../../../assect/style/var.less";
.fixedFooter {
  padding-bottom: 60px;
}
.step2-tip {
  text-align: center;
  padding: 70px 0;
  position: relative;
  font-size: 0px;
  .step2-arrow {
    position: absolute;
    left: 60px;
    top: 20px;
    width: 40px;
  }
  .step2-demo {
    width: 180px;
  }
  p {
    color: @RegularText;
    font-size: 15px;
  }
}
</style>