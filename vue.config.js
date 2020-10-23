module.exports = {
  devServer: {
    disableHostCheck: true, // for ngrok
    port: 42069
  },
  chainWebpack: config => {
    config.module
      .rule('mjs-support')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto');
  }
};