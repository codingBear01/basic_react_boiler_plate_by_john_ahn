const { User } = require('../models/User');

/* index.js의 auth route에서 실행되는 middlewawrek로 client token과 DB token을 비교 */
let auth = (req, res, next) => {
  // client cookie에서 token을 가져 옴.
  let token = req.cookies.x_auth;

  // findByToken method 생성하여 middleware 작업 수행
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    // user가 없으면(token이 일치하지 않으면) err 반환
    if (!user) return res.json({ isAuth: false, error: true });

    // token이 일치하면 token 및 user 정보 저장
    req.token = token;
    req.user = user;

    // middleware 작업 완료 후 다음 작업 진행
    next();
  });
};

module.exports = { auth };
