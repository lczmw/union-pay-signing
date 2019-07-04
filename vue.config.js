const path = require('path');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const modifyVars = require('./src/modifyVars.js');
const port = 9528;
module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  publicPath: process.env.NODE_ENV === 'production' ? '//imgw.pospal.cn/unionPaySign' : '/',

  devServer: {
    port: port,
    open: false,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    proxy: {
      '/wxapi': {
        target: 'https://wxchengxubak.pospal.cn/wxapi/',
        // target: 'http://192.168.2.197:29429/',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/wxapi': ''
        }
      }
    },
    disableHostCheck: true
    // after: require('./mock/mock-server.js')
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer']
          })
        ]
      },
      less: {
        modifyVars: modifyVars
      }
    }
  }
};
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, 'src/assect/style/var.less')]
    });
}
