import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function Landing() {
  // TODO: create landing ui
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home');
  }, []);

  return null;
}

export default Landing;
