<template>
  <div class="stepFour" v-if="signing.apply_status !== '-1'">
    <div class="greyBg"></div>
    <!-- 加载中 -->
    <div class="step-status" v-if="signing.apply_status === '-1'">
      <div class="step-status-title">
        <div class="step-status-msg">
          <div>加载中...</div>
        </div>
      </div>
    </div>

    <!-- 签约中 -->
    <div class="step-status" v-else-if="signing.apply_status === '01'">
      <div class="step-status-title">
        <img class="step-status-img" src="../../../assect/img/pass-img.png">
        <div class="step-status-msg">
          <div>您的银联商务签约成功，等待审核</div>
        </div>
      </div>
    </div>

    <!-- 成功 -->

    <template  v-else-if="signing.apply_status === '03'">
      
   
      <div class="step-status">
        <div class="step-status-title">
          <img class="step-status-img" src="../../../assect/img/pass-img.png">
          <div class="step-status-msg">
            <div>恭喜！您的银联商务入驻申请</div>
            <div class="fz20">审核已通过</div>
          </div>
        </div>
      </div>

      <div class="ext-info">
        <div class="ext-info__title">
          已经为您接入的应用服务有：
        </div>

        <div class="ext-info__block" v-for="(item, index) in mappNoResults" :key="index">
            <div class="ext-info__name">{{ getApptype(item.apptype_id) }}</div>
            <div class="ext-info__row" v-if="item.apptype_id === '9'">
              应用场景：{{ getAppscenes() }}
            </div>
            <div class="ext-info__row" v-if="item.apptype_id === '9' && [2,3].includes(signing.product_csb_type)">
              APPID：{{ signing.product_csb_remark }}
            </div>
            <div class="ext-info__row is-spc">
              商户号：{{ item.mapp_no }}
            </div>

            <div class="ext-info__row" v-for="(item, index) in item.term_app_no_list" :key="index">
              <div>终端号：{{ item.term_app_no }}</div><div>银豹账号： {{ item.pospal_account }}</div>

            </div>
        </div>
      </div>

    </template>

    <!-- 提交 -->
    <div class="step-status" v-else-if="signing.apply_status === '02'">
      <div class="step-status-title">
        <img class="step-status-img" src="../../../assect/img/submit.png">
        <div class="step-status-msg">
          <div class="fz20">您的资料信息已提交</div>
          <div>正在审核中，客官莫急哦</div>
        </div>
      </div>
      <div class="step-status-content">
        <span class="dot">●</span>审核成功后将会短信通知手机
        <span class="red">{{ (signing.legal_mobile || '').replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") }}</span>
      </div>
    </div>

     <!-- 失败 -->
    <div class="step-status" v-else>
      <div class="step-status-title">
        <img class="step-status-img" src="../../../assect/img/fail-img.png">
        <div class="step-status-msg">
          <div>您的银联商务入驻申请</div>
          <div class="fz20">{{ signing.apply_status_msg }}</div>
        </div>
      </div>
      <div class="step-status-content" v-if="signing.fail_reason !== ''">
        <span class="dot red">●</span>审核失败原因:
        <span class="red">{{ signing.fail_reason }}</span>
      </div>
    </div>

    <!-- 调用失败 -->
<!--     <div class="step-status" v-if="status == 4">
      <div class="step-status-title">
        <img class="step-status-img" src="../../../assect/img/order-fail.png">
        <div class="step-status-msg">
          <div>签约服务调用失败</div>
          <div class="fz20">请稍后再试</div>
        </div>
      </div>
    </div> -->

    <!-- div class="step-tip">
      <div>
        <van-icon name="info-o"/>
        <span class="blue">提示</span>
      </div>
      <p>
        如有更多服务需求或者希望和银联商务达成合作，敬请访问
        <span class="blue">银联商务官网</span>查看服务项目并加入我们。
      </p>
      <p class="red">审核结果将以短信通知，您也可以通过拨打95534客服热线查询。协议自审核通过之日起生效。</p>
    </div> -->
   <!--  <footer v-if="signing.apply_status !== '03'">
      <van-button type="primary" size="large" @click="reapply">重新申请</van-button>
    </footer> -->
  </div>
</template>

<script>
import { getStore } from '@/utils'
import Cookies from 'js-cookie'
import { reSgin } from '@/api'
export default {
  data() {
    return {
      status: '-1',
      signing: {
        apply_status: '-1'
      },
      mappNoResults: []
    }
  },
  methods: {
    init() {
      let signing = getStore('pospal_signing', true);
      this.signing = signing;
      this.mappNoResults = signing.mapp_no_results  || []
    },
    reapply() {
      reSgin({
        'sign_id': Cookies.get('sign_id'),
      })
      .then(() => {
        this.$emit('on-reapply')
      })
      .catch(() => {
        
      })
    },
    getApptype(type) {
      let map = {
        '9': 'C扫B',
        '68': 'B扫C',
      }
      return typeof map[type] === 'undefined' ? '-' : map[type]
    },
    getAppscenes() {
      let map = {
        0: '收银机',
        1: '公众号支付',
        2: '小程序支付',
      }
      return map[this.signing.product_csb_type]
    },
  }
}
</script>

<style lang="less" scoped>
@import "../../../assect/style/var.less";

.ext-info{
  padding: 0 20px;
}
.ext-info__title{
  color: #6F737D;font-size: 12px;margin-bottom: 10px;
}

.ext-info__block{
  padding: 10px;margin-bottom: 10px;background: #FAFAFA;
}

.ext-info__name{
  color: #1D84FA;font-size: 14px;margin-bottom: 5px;
}

.ext-info__row{
  color: #9B9B9B;font-size: 12px;display: flex;justify-content: space-between;
  &:not(:last-child){
    padding-bottom: 5px;
  }
  &.is-spc{
    margin-bottom: 5px;
    border-bottom: 1px solid #EDEDED
  }
}


.stepFour {
  background-color: #fff;
  .step-status {
    padding: 30px;
    &-title {
      overflow: hidden;
    }
    &-img {
      height: 55px;
      float: left;
      margin-right: 10px;
    }
    &-msg {
      font-size: 14px;
      color: #151515;
    }
    &-content {
      font-size: 12px;
      color: #414b51;
      padding: 10px;
      span.red {
        color: #f44;
      }
    }
  }
  .step-tip {
    background: #f6faff;
    border: 1px solid #daeaf4;
    padding: 20px;
    margin: 20px 30px 64px;
    font-size: 11px;
    // margin-top: 0.1rem;
    color: #6F737D;
    p{
      margin-top: 10px;
    }
    .van-icon{
      color: @Primary;
      vertical-align: middle;
      margin-right: 4px;
    }
  }
}
</style>