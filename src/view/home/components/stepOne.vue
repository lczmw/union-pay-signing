<template>
  <div :class="footerHS?'fixedFooter':''">
    <div class="stepOne">
      <van-cell-group class="mt10">
        <van-field
          v-model="realName.name"
          label="法人姓名"
          placeholder="请输入法人姓名"
          :disabled="oneDisabled"
          :error="realError.name"
          @focus="onFocus('name')"
        />
        <van-field
          v-model="realName.tel"
          label="手机号"
          type="tel"
          placeholder="请输入手机号"
          :disabled="oneDisabled"
          :error="realError.tel"
          @focus="onFocus('tel')"
        />
        <!-- <van-field
          v-model="realName.code"
          center
          clearable
          label="验证码"
          placeholder="请输入验证码"
          :disabled="oneDisabled"
          :error="realError.code"
          @focus="onFocus('tel')"
        > -->
        <!--  <van-button
            v-show="sendAuthCode"
            slot="button"
            size="small"
            type="primary"
          :disabled="oneDisabled"
            @click="getAuthCode"
          >{{codeMsg}}</van-button>
          <van-button
            v-show="!sendAuthCode"
            slot="button"
            size="small"
            type="anthCode"
          :disabled="oneDisabled"
          >{{auth_time}}s</van-button> -->
        </van-field>
        <van-field
          v-model="realName.email"
          label="邮箱"
          placeholder="请输入邮箱"
          :disabled="oneDisabled"
          :error="realError.email"
          @focus="onFocus('email')"
        />
        <van-field
          v-model="realName.idCard"
          label="身份证号码"
          placeholder="请输入身份证号码"
          :disabled="oneDisabled"
          :error="realError.idCard"
          @focus="onFocus('idCard')"
        />
        <van-field
          v-model="realName.date"
          label="身份证有效期"
          placeholder="请选择"
          right-icon="arrow"
          readonly
          :disabled="oneDisabled"
          @click="showDate = true"
        />
      </van-cell-group>
      <section class="home-upload">
        <div class="home-upload-txt">
          身份证正反面拍照
          <span>(图片支持jpg、png、bmg格式，文件不超过2M)</span>
        </div>
        <div class="home-upload-content">
          <Upload
            type="2"
            document-type="0001"
            :disabled="oneDisabled"
            not-uploaded-tip="请上传身份证头像页"
            ref="upload0"
          />
          <Upload
            type="3"
            document-type="0011"
            :disabled="oneDisabled"
            not-uploaded-tip="请上传身份证国徽页"
            ref="upload1"
          />
        </div>
      </section>
      <section class="home-agree">
        <van-checkbox
          v-model="checked"
          :disabled="oneDisabled"
        >我同意并已阅读</van-checkbox>
        <span
          class="primaryTxt"
          @click="showAgreeFun"
        >《银联商务商户自助签约知情同意书》</span>
      </section>
      <van-popup
        v-model="showDate"
        position="bottom"
      >
        <van-datetime-picker
          v-model="currentDate"
          :max-date="maxDate"
          :min-date="minDate"
          type="date"
          @confirm="confirmDate"
          @cancel="showDate=false"
        />
      </van-popup>
    </div>
    <!-- <footer :style="footerHS?'':'position:relative'">
      <van-button type="primary" size="large" @click="nextPage">下一步</van-button>
    </footer>-->
    <footer :style="footerHS?'':'position:relative'">
      <div class="doubleBtn">
        <van-button
          type="warning"
          size="large"
          @click="goBack"
        >上一步</van-button>
        <van-button
          type="primary"
          size="large"
          @click="nextPage"
        >下一步</van-button>
      </div>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import Upload from '@/components/Upload';
import { getDay } from '@/utils';
import { setRealUserInfo } from '@/api';
export default {
  // mixins: [footerShow],
  components: {
    Upload
  },
  props: {
    footerHS: true
  },
  data() {
    return {
      checked: true,
      oneDisabled: false,
      realName: {
        name: '',
        tel: '',
        // code: '',
        email: '',
        idCard: '',
        date: ''
      },
      realError: {
        name: false,
        tel: false,
        // code: false,
        email: false,
        idCard: false
      },
      sendAuthCode: false,
      auth_time: 0,
      // codeMsg: '获取验证码',
      showDate: false,
      currentDate: new Date(),
      minDate: new Date(),
      maxDate: new Date(getDay('addYear', new Date(), 100))
    };
  },
  methods: {
    init() {
      this.initPageData();
      this.initUploadStatus();
    },
    confirmDate(value) {
      this.showDate = false;
      this.realName.date = getDay('day', value);
    },

    getParams() {
      let params = {
        sign_id: Cookies.get('sign_id'),
        legal_name: this.realName.name,
        legal_idcard_no: this.realName.idCard,
        legal_mobile: this.realName.tel,
        legal_email: this.realName.email,
        legal_card_deadline: this.realName.date
      };
      return params;
    },
    showAgreeFun() {
      this.$emit('showAgree');
    },
    onFocus(key) {
      this.realError[key] = false;
    },
    nextPage() {
      let params = this.getParams();

      let validField = {
        legal_name: '请填写法人姓名',
        legal_mobile: {
          re: /^[1][3,4,5,7,8,9][0-9]{9}$/,
          emptyMsg: '请填写手机号',
          reMsg: '手机号格式有误'
        },
        legal_email: {
          re: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
          emptyMsg: '请填写邮箱',
          reMsg: '邮箱格式有误'
        },
        legal_idcard_no: {
          re: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          emptyMsg: '请填写身份证号码',
          reMsg: '身份证号码格式有误'
        },
        legal_card_deadline: '请选择身份证过期日'
      };
      this.globalMixin_validFormEmpty(validField, params)
        .then(() => {
          if (!this.isImagesListUploaded()) {
            return;
          }

          if (!this.checked) {
            this.$toast({
              message: '请勾选知情同意书'
            });
            return;
          }
          setRealUserInfo(params)
            .then(({ result }) => {
              this.globalMixin_updateSigning(result);
              this.$emit('nextPage');
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    isImagesListUploaded() {
      let uploadIndexList = ['0', '1'];
      let notUploaded = uploadIndexList.some((item, index) => {
        return this.$refs[`upload${item}`].hasUploaded() === false;
      });
      return !notUploaded;
    },
    initUploadStatus() {
      ['0', '1'].forEach(item => {
        this.$refs[`upload${item}`].init();
      });
    },
    goBack() {
      this.$emit('goBack');
    },
    initPageData() {
      let {
        legal_name,
        legal_idcard_no,
        legal_mobile,
        legal_email,
        legal_card_deadline
      } = this.globalMixin_getSigning();

      this.realName.name = legal_name;
      this.realName.idCard = legal_idcard_no;
      this.realName.tel = legal_mobile;
      this.realName.email = legal_email;
      this.realName.date = legal_card_deadline;
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.fixedFooter {
  padding-bottom: 60px;
}
</style>