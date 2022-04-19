const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

// 개발 환경에 따라 달라지는 mongoURI를 받아오기 위해 key.js를 통해 export된 module import
const config = require('./config/key');

// export했던 User model을 import
const { User } = require('./models/User');

// application/x-www-form-urlencoded 형식 데이터를 parsing
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형식 데이터를 parsing
app.use(bodyParser.json());

// mongoose를 활용하여 mongoDB와 연결
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI) // config 변수를 통해 property mongoURI의 value를 받아옴
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// client register route
app.post('/register', (req, res) => {
  // 회원 가입 시 필요한 정보를 client단에서 가져와 db에 입력
  // User model 내 데이터를 body-parser를 통해 json 형식으로 req.body에서 받음.
  const user = new User(req.body);

  // save()는 mongoDB의 method. 수신한 정보를 저장.
  user.save((err, userInfo) => {
    // 정보 수신 실패 시 json 내 success property에 false와 함께 err 전달
    if (err) return res.json({ success: false, err });
    // 정보 수신 성공 시 json 내 success property에 true 전달
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listeninig on port ${port}`);
});
