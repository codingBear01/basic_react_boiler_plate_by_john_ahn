// process.env.NODE_ENV는 환경 변수. local에서 작업 시 'development'이고 배포한 후는 'production'임.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}
