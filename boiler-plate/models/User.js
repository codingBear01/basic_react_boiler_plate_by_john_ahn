const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// bcrypt를 통해 비밀번호를 10자리 문자열로 hashing
const saltRounds = 10;

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

// pre()는 mongoose의 method로 첫 번째 parameter의 method가 실행되기 전에 두 번째 parameter를 실행. 이 경우 user model에 정보가 저장되기 전에 함수를 실행.
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
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
