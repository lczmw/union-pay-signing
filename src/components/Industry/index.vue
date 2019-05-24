<template>
  <div class="industry-wrapper">
    <header ref="header">
      <van-nav-bar title="所属行业" left-arrow @click-left="hideIndustry"/>
      <div class="industry-title">
        <div class="industry-title-item w40">
          <span class="dot">●</span>行业分类
        </div>
        <div class="industry-title-item w60">
          <span class="dot">●</span>行业列表
        </div>
      </div>
    </header>
    <van-tree-select
      :items="items"
      :height="treeHeight"
      :main-active-index="mainActiveIndex"
      :active-id="activeId"
      @navclick="onNavClick"
      @itemclick="onItemClick"
    />

    <footer ref="footer">
      <van-button type="primary" size="large" @click="hideIndustry(activeId)">确定</van-button>
    </footer>
  </div>
</template>

<script>
const industryData = require('../../assect/json/industry.js')
export default {
  data() {
    return {
      treeHeight: window.innerHeight - 50,
      items: industryData,
      // 左侧高亮元素的index
      mainActiveIndex: 0,
      // 被选中元素的id
      activeId: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.$nextTick(() => {
        this.getHeight()
      })
    }
  },
  methods: {
    getHeight() {
      if (
        typeof this.$refs.header !== 'undefined' && typeof this.$refs.footer !== 'undefined'
      ) {
        this.treeHeight = window.innerHeight - this.$refs.header.offsetHeight - this.$refs.footer.offsetHeight
      }
    },
    onNavClick(index) {
      this.mainActiveIndex = index;
    },
    onItemClick(data) {
      this.activeId = data.id;
      this.activeText = data.text
    },
    hideIndustry(activeId) {
      this.$emit('hideIndustry', activeId, this.activeText)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assect/style/var.less";
.van-tree-select__nav {
  width: 40%;
}
.van-tree-select__content {
  width: 60%;
  margin-left: 40%;
  padding-left:0px;
}
.van-tree-select__nitem--active::after {
  background-color: @Primary;
}
.van-tree-select__item--active {
  color: @Primary;
}
.van-tree-select__nav {
  background: #eff1f6;
}
.van-tree-select__nitem {
  font-weight: normal;
  line-height: 20px;
  height: 54px;
  display: flex;
  align-items: center;
  overflow: auto;
  white-space:normal;
}

.van-tree-select__item {
  border-bottom: 1px solid #edeff1;
  font-weight: normal;
  line-height: 20px;
  height: 54px;
  padding: 5px 10px;
  box-sizing:border-box;
  display: flex;
  align-items: center;
  overflow: auto;
  white-space:normal;
}
.industry-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 0;
  box-sizing: border-box;
  background: #fafafa;
  &-item {
    display: inline-block;
    font-size: 13px;
    vertical-align: middle;
    &.w40 {
      width: 40%;
    }
    &.w60 {
      width: 60%;
    }
  }
}
.industry-wrapper {
  position: relative;
  background: @White;
  height: 100vh;
  padding-top: 80px;
  padding-bottom: 70px;
  box-sizing: border-box;
  overflow: hidden;
  header {
    position: fixed;
    width: 100%;
    top: 0px;
    left: 0px;
    z-index: 2;
  }

  footer {
    position: fixed;
    width: 100%;
    padding: 10px;
    bottom: 0px;
    left: 0px;
    font-size: 0px;
    background: @White;
    box-sizing: border-box;
    .van-button--large {
      height: 42px;
      line-height: 40px;
      font-size: 18px;
      background-color: #4190de;
      border-color: #4190de;
      font-weight: 600;
    }
  }
}
</style>