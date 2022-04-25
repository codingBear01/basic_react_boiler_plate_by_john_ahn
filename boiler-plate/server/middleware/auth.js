// const { User } = require('../models/User');

// /* index.js의 auth route에서 실행되는 middlewawrek로 client token과 DB token을 비교 */
// let auth = (req, res, next) => {
//   // client cookie에서 token을 가져 옴.
//   let token = req.cookies.x_auth;

//   // findByToken method 생성하여 middleware 작업 수행
//   User.findByToken(token, (err, user) => {
//     if (err) throw err;
//     // user가 없으면(token이 일치하지 않으면) err 반환
//     if (!user) return res.json({ isAuth: false, error: true });

//     // token이 일치하면 token 및 user 정보 저장
//     req.token = token;
//     req.user = user;

//     // middleware 작업 완료 후 다음 작업 진행
//     next();
//   });
// };

// module.exports = { auth };

const { User } = require('../models/User');

let auth = (req, res, next) => {
  // 인증 처리 구현
  // client cookie에서 token을 가져온다
  let token = req.cookies.x_auth;
  // token을 복호화한 후 user를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); // middleware 실행 끝났으면 다음 절차로 넘어감.
  });
  // user 있으면 인증 O 없으면 X
};

module.exports = { auth };
