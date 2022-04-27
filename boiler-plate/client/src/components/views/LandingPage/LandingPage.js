import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/hello').then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get('/api/users/logout').then((response) => {
      if (response.data.success) {
        navigate('/login');
      } else {
        alert('Failed to logout');
      }
    });
  };

  return (
    <div className="page_wrap">
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>Logout</button>
    </div>
  );
}

export default LandingPage;
