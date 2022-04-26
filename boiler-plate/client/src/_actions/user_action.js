import axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(dataToSubmit) {
  // server에서 받은 data를 변수 request에 저장하여 redux로 전송.
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}
