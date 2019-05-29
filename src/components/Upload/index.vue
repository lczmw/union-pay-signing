<template>
  <van-uploader :after-read="onRead" :disabled="disabled" class="home-upload-content-item">
    <img :src="url" alt v-if="!showUploadedImg">

    <div v-else class="upload-img-wrapper">
        <img :src="url" alt>
        <div>重新上传</div>
    </div>
  </van-uploader>
</template>

<script>

import Cookies from 'js-cookie'
import { uploadPic } from '@/api'
export default {
  props: {
    type: {
      defalut: '1',
    },
    documentType: {
      type: String,
      defalut: '0001'
    },
    notUploadedTip: {
      type: String,
      defalut: ''
    },
    disabled: {
      defalut: false
    },

    // document_type: {
    //   // require:true
    // }
  },
  data() {
    return {
      url: require('../../assect/img/add.png'),
      uploaded: false,
      showUploadedImg: false
    }
  },
  created() {

  },
  methods: {
    init() {
      let { pic_list } = this.globalMixin_getSigning();
      let pucList = Object.prototype.toString.call(pic_list) === '[object Array]' ? pic_list : [];
    
      let hasUploaded = pucList.some((item) => {
        return item.document_type === this.documentType
      })
      if (hasUploaded) {
        this.url = require('../../assect/img/hasUpload.png');
        this.showUploadedImg = true;
        this.uploaded = true;
        
      }else {
         switch (this.type) {
          case '1':
            this.url = require('../../assect/img/add.png')
            break
          case '2':
            this.url = require('../../assect/img/cardFace.png')
            break
          case '3':
            this.url = require('../../assect/img/cardReverse.png')
            break
          case '4':
            this.url = require('../../assect/img/selfie.png')
            break
          default:
            this.url = require('../../assect/img/add.png')
        }

        this.showUploadedImg = false;
        this.uploaded = false;
      }

     
    },
    onRead(file) {
      this.url = file.content
      // console.log('sign_id',Cookies.set('sign_id'))
      uploadPic({
        document_type: this.documentType,
        pic_base64: this.url,
        sign_id: Cookies.set('sign_id')
      }).then(res => {
        this.uploaded = true
        this.$toast({
          message: '上传成功',
          duration: 1500
        })
      })
    },
    hasUploaded() {
      if (!this.uploaded && this.notUploadedTip !== '') {
        this.$toast(this.notUploadedTip)
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>

  .upload-img-wrapper{
    display: flex;flex-direction: column;
  }
  .upload-img-wrapper img{
    height: 80px!important;
  }
  .upload-img-wrapper div{
    flex: auto; background: #1D84FA;height: 27px;display: flex;align-items: center;justify-content: center;font-size: 12px;color: #FFFFFF
  }
</style>