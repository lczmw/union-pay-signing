<template>
  <van-area
      :area-list="areaList"
      :columns-num="num"
      show-toolbar
      @confirm="confirmArea"
      @cancel="hideArea"
      :value="areaValue"
    />
</template>

<script>

const areaData = require('../../assect/json/area.js')
export default {
  props: {
    areaValue: {
      type: String,
      required:true
    },
    num:{
      default:3
    }
  },
  data() {
    return {
      areaList: areaData,
    }
  },
  created() {
  },
  methods: {
    hideArea() {
      this.$emit('hideArea')
    },
    confirmArea(data) {
      this.$emit('confirmArea', data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>