<template>
  <van-uploader :after-read="onRead" :disabled="disabled" class="home-upload-content-item">
    <img :src="url" alt>
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
      uploaded: false
    }
  },
  created() {
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

    if (this.type == 1) {
      this.url = require('../../assect/img/add.png')
    }
  },
  methods: {
    onRead(file) {
      this.url = file.content
      console.log('sign_id',Cookies.set('sign_id'))
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
</style>