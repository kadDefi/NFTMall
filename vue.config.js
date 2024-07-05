
'use strict'
const path = require('path')
const webpack = require('webpack')
const settingConfig = require('./src/settings.js')
// 内存泄露
require('events').EventEmitter.defaultMaxListeners = 0

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = settingConfig.name;
const baseURL = settingConfig.baseOneURL;

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 8080 npm run dev OR npm run dev --port = 8080
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
    publicPath: './',
    indexPath:'index.html',
    outputDir: process.env.outputDir,
    //assetsDir: process.env.assetsDir,
    lintOnSave: false, //process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
      proxy: {
        '/api': {
          target: baseURL, //要调用的接口 18.162.96.221  118.195.189.195:8893
          ws: false, //如果要代理 websockets，配置这个参数
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, //是否跨域
          pathRewrite: {
            '^/api': '',
          },
        },
		    "/dev": {
          target: baseURL, //要调用的接口 18.162.96.221  118.195.189.195:8893
          ws: false, //如果要代理 websockets，配置这个参数
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, //是否跨域
          pathRewrite: {
            '^/api': '',
          },
		    },
      },
    },
    // icon
    pwa: {
      iconPaths: {
        favicon32: 'favicon.ico',
        favicon16: 'favicon.ico',
        appleTouchIcon: 'favicon.ico',
        maskIcon: 'favicon.ico',
        msTileImage: 'favicon.ico',
      },
    },
    //  全局样式
    css: {
      loaderOptions: {
        sass: {
          additionalData: `@import "@/styles/variables.scss"; @import "@/styles/mixin.scss";`
        }
      }
    },
    configureWebpack: (config) => {
      config.name = name;
      if(process.env.NODE_ENV === 'production') {
        config.mode = 'production';
        config["performance"] = {//打包文件大小配置
          "maxEntrypointSize": 50000000, // 入口起点的最大体积
          "maxAssetSize": 30000000,// 生成文件的最大体积
        }
        // 生产环境取消 console.log
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      }else{
       // 为开发环境修改配置
        config.mode = 'development';
      }
   },
}