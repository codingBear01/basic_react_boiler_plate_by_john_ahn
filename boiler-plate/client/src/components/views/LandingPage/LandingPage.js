import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
  useEffect(() => {
    axios.get('/api/hello').then((response) => console.log(response.data));
  }, []);

  return (
    <div className="landing_div">
      <h2>시작 페이지</h2>
    </div>
  );
}

export default LandingPage;
