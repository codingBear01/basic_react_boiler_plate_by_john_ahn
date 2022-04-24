const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
// token을 cookie에 저장하기 위한 cookie-parser define
const cookieParser = require('cookie-parser');
// 개발 환경에 따라 달라지는 mongoURI를 받아오기 위해 key.js를 통해 export된 module import
const config = require('./config/key');
// 인증 기능 구현을 위한 middleware auth define
const { auth } = require('./middleware/auth');

// export했던 User model을 import
const { User } = require('./models/User');

// application/x-www-form-urlencoded 형식 데이터를 parsing
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형식 데이터를 parsing
app.use(bodyParser.json());
// apply cookie-parser
app.use(cookieParser());

/* mongoose를 활용하여 mongoDB와 연결 */
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI) // config 변수를 통해 property mongoURI의 value를 받아옴
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/* client register route */
app.post('/api/users/register', (req, res) => {
  // 회원 가입 시 필요한 정보를 client단에서 가져와 db에 입력
  // User model 내 데이터를 body-parser를 통해 json 형식으로 req.body에서 받음.
  const user = new User(req.body);

  // save()는 mongoDB의 method. 수신한 정보를 저장.
  user.save((err, userInfo) => {
    // 정보 수신 실패 시 json 내 success property에 false와 함께 err 전달
    if (err) return res.json({ success: false, err });
    // 정보 수신 성공 시 json 내 success property에 true 전달
    return res.status(200).json({ success: true });
  });
});

/* client login route */
app.post('/api/users/login', (req, res) => {
  // mongoDB에서 제공하는 findOne() method로 입력된 email: req.body.email과 DB 내 email이 일치한다면 user 반환
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Not found povided email!',
      });
    }

    // 입력한 email 정보가 일치한다면 comparePassword method를 통해 req.body.password와 DB 내 비밀번호 일치 여부 확인하여 isMatched 반환
    user.comparePassword(req.body.password, (err, isMatched) => {
      if (!isMatched)
        return res.json({
          loginSuccess: false,
          message: 'Not matched password',
        });

      // password가 일치한다면 generateToken() method 생성하여 입력된 user의 token을 생성
      user.generateToken((err, user) => {
        // err가 발생한다면 client에 400 및 err msg 전달
        if (err) return res.status(400).send(err);

        // token은 cookie, localstorage 등에 저장 가능. 여기서는 client단의 cookie에 저장
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

/* auth route: client cookie 안의 token을 복호화하여 server DB 안의 token과 비교하는 식으로 인증 기능 구현 */
app.get('/api/users/auth', auth, (req, res) => {
  // middleware auth가 true로 반환되면 아래 정보들을 client에 json 형식으로 전달
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.lastname,
    role: req.role,
    image: req.image,
  });
});

app.listen(port, () => {
  console.log(`Example app listeninig on port ${port}`);
});
