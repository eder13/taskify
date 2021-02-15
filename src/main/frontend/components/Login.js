import React, {useLayoutEffect} from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {loadingBooleanSelector, loginInfoSelector} from "../store/auth/auth";

const Section = styled.section`
  margin-top: 100px;
`;

const DivFlexedCenter = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const LoginContainer = styled.div`
  margin-top: 2rem;
  width: 20rem;
  height: 13rem;
  background-color: rgb(232, 232, 232);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 3px 3px 5px 6px #ccc;
`;

const Notification = styled.div`
  text-align: center;
  margin: 20px 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid ${props => props.info ? "#bce8f1" : "#f5c6cb"};
  background-color: ${props => props.info ? "#d9edf7" : "#f8d7da"};
  color: ${props => props.info ? "#31708f" : "#721c24"};
`;

const GoogleBtn = styled.div`
  border: none;
  width: 184px;
  height: 42px;
  background-color: #4285f4;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  text-decoration: none;
  
  &:hover {
    box-shadow: 0 0 6px #4285f4;
  }
  
  &:active {
    background: #1669F2;
  }
`;

const GoogleIconWrapper = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: white;
    margin-left: 1px;
    margin-top: 1px;
`;

const GoogleIcon = styled.img`
  position: absolute;
  left: 0;
  margin-top: 11px;
  margin-left: 11px;
  width: 18px;
  height: 18px;
`;

const BtnText = styled.p`
    padding-left: 3rem;
    color: white;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-weight: 300;
`;

const Login = (props) => {

  // loginInfoSelector
  const loginState = useSelector(loginInfoSelector);
  const loading = useSelector(loadingBooleanSelector);

  useLayoutEffect(() => {
    // check if user is authenticated - redirect if yes
    if (loginState.isAuthenticated)
      props.history.push("/dashboard");

  }, [loginState.isAuthenticated]);

  if (!loading) {
    return (
      <Section>
        <DivFlexedCenter>
          <p>You are just one click away! Give it a shot.</p>

          {loginState.notification.error !== "" &&
          <Notification>
            {loginState.notification.error}
          </Notification>
          }
          <LoginContainer>
            <h1>Login</h1>
            <GoogleBtn as="a" href="/oauth2/authorization/google">
              <GoogleIconWrapper>
                <GoogleIcon
                     src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                     alt="Google Logo"
                />
              </GoogleIconWrapper>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', margin: '0', padding: '0', paddingRight: '0.5rem'}}>
                <BtnText className="btn-text">Sign in with Google</BtnText>
              </div>
            </GoogleBtn>
          </LoginContainer>
        </DivFlexedCenter>
      </Section>
    );
  } else {
    return (
      <div className="loader-wrap">
        <div className="loader">{}</div>
      </div>
    );
  }
}

export default Login;