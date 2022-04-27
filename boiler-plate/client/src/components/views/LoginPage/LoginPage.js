import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const dispatch = useDispatch();
  // v6부터 props.history.push() 대신 userNavigate() 메서드로 페이지 이동
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // userDispatch() 메서드를 통해 client단에서 입력된 값으로 인증 작업 거친 후 login
    let body = {
      email: Email,
      password: Password,
    };

    /* if don't use Redux? 
    Axios.post('/api/users/login', body) */

    // redux 활용을 위해 userDispatch() 메서드로 data submit action을 수행
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        navigate('/');
      } else {
        alert('Failed to login');
      }
    });
  };

  return (
    <div className="page_wrap">
      <form className="login_form" onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
