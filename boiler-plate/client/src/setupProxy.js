const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // client단 3000 port에서 server단 5000 port로 data 전송
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
