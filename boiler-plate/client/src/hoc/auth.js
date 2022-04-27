import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
  /*
  option in parameter 종류
  null: 아무나 출입 가능
  true: login한 user만
  false: login한 user 빼고
  */

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // if not login?
        if (!response.payload.isAuth) {
          if (option) {
            navigate('/login');
          }
        } else {
          // if login?
          // if adminRoute true but isAdmin false?
          if (adminRoute && !response.payload.isAdmin) {
            navigate('/');
          } else {
            if (option === false) {
              navigate('/');
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
}
