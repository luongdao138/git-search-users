import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import loginImg from '../images/login-img.svg';
const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Wrapper>
      <div>
        <img src={loginImg} alt='' />
        <h1>github user</h1>
        <button className='btn' onClick={loginWithRedirect}>
          Login / sign up
        </button>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.section`
  min-height: 100vh;
  padding: 2rem 0;
  text-align: center;
  display: grid;
  place-items: center;
  .container {
    width: 90vw;
    max-width: 600px;
    text-align: center;
  }
  img {
    margin: auto;
    margin-bottom: 2rem;
    width: 50%;
  }
  h1 {
    margin-bottom: 1.5rem;
  }
`;
export default Login;
