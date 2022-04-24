const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// bcrypt를 통해 비밀번호를 10자리 문자열로 hashing
const saltRounds = 10;
// token 생성 위한 jsonwebtoken define
const jwt = require('jsonwebtoken');

/* user data 생성하는 데 쓰일 userSchema 생성 */
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

/* pre()는 mongoose의 method로 첫 번째 parameter의 method가 실행되기 전에 두 번째 parameter를 실행. 이 경우 user model에 정보가 저장되기 전에 함수를 실행. */
userSchema.pre('save', function (next) {
  // this는 user model을 가리킴.
  const user = this;
  console.log(this);

  // user model 내의 password property가 변경될 때만 암호화 수행
  if (user.isModified('password')) {
    // 먼저 salt를 생성하고 생성된 salt를 통해 비밀번호 암호화
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      // user model에 들어 있는 plain password를 첫 번째 parameter로 받아서 hashing
      bcrypt.hash(user.password, salt, (err, hash) => {
        // 암호화에 실패하면 next()를 통해 err를 표출하고 성공하면 user.password의 value를 hash로 변경
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    // 비밀번호 이외에 다른 data 변경 시 next() 실행
    next();
  }
});

/* 비밀번호 비교에 쓰일 comparePassword() method 생성 */
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 입력된 plainPassword를 암호화한 후 DB 내 암호화된 password와 비교 후 일치한다면 isMatched 반환
  bcrypt.compare(plainPassword, this.password, function (err, isMatched) {
    if (err) return cb(err);
    cb(null, isMatched);
  });
};

/* token 생성에 쓰일 generateToken() method 생성 */
userSchema.methods.generateToken = function (cb) {
  const user = this;

  // DB의 각 id에 jsonwebtoken으로써 token 부여
  const token = jwt.sign(user._id.toHexString(), 'userToken');

  // 위에서 생성한 token을 userSchema의 token field에 저장
  user.token = token;

  // updated user data를 저장하다 err가 없다면 callback으로 user정보만 전달
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

/* client와 server의 token 일치 여부 확인하는 method */
userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  // decode token
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // '_id'를 통해 user를 찾은 다음 client token과 DB token 일치 여부 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
