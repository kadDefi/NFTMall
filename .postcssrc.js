module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不一样的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    "postcss-px-to-viewport": {
      unitToConvert: "px", // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ["*"], // 指定转换的css属性的单位，*表明所有css属性的单位都进行转换
      viewportUnit: "vw", // 指定须要转换成的视窗单位，默认vw
      fontViewportUnit: "vw", // 指定字体须要转换成的视窗单位，默认vw
      selectorBlackList: ["wrap"], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/,/views/,/zoonHeader/,/announcement/,/zoonFooter/,/pagination/,/markCard/,/creatorCard/,/laboraCard/,/stockCard/,/holdCard/,/hotCard/,/shopCard/,/deliveryCard/,/orderCard/,/dialogmsg/,/loading/,/styles/], // 设置忽略文件，用正则作目录名匹配
      landscape: false // 是否处理横屏状况
    }
  }
};
