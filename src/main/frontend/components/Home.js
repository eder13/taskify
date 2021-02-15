import React from 'react';
import {useSelector} from "react-redux";
import {loadingBooleanSelector, loginIsAuthenticatedSelector} from "../store/auth/auth";
import styled from "styled-components";
import {Link} from "react-router-dom";

const Section = styled.section`
  background-color: rgb(229, 246, 249);
  color: rgb(34, 27, 113);
  margin-top: 0;
  padding-top: 0;
  flex-flow: column;
  text-align: center;
  height: 100vh;
  
  & div:first-child {
  
    padding-top: 7rem;
    padding-bottom: 5rem;
    background-color: rgb(229, 246, 249);
  
    & h1 {
      margin: 0 0;
      padding-bottom: 2rem;
      padding: 0 1.5rem;
    }
  }
  
  & div:last-child {
    background-color: rgb(229, 246, 249);
    & p {
      margin-top: 2rem;
    }
    padding-bottom: 4rem;
  }
`;

const Button = styled.button`
    color: white;
    background-color: rgb(63, 119, 255);
    border: none;
    font-family: 'Ubuntu', sans-serif;
    font-weight: 300;
    padding: 1.25rem 6rem;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.4s ease-out;
    
    &:hover {
      background-color: rgb(63, 119, 200);
    }
`;

const Home = () => {

  // login Loading: Let firstly dispatch everything and see if user is still logged in
  const loading = useSelector(loadingBooleanSelector);
  const isAuthenticated = useSelector(loginIsAuthenticatedSelector);

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader">{}</div>
      </div>);
  } else {
    return (
      <Section>

        <div>
          <h1>Manage your Tasks with a breeze.</h1>

          <img style={{maxWidth: '470px'}} width="70%" src="https://blush.design/api/download?shareUri=AtJqwLxSI&w=800&h=800&fm=png"
               alt="messy doodle image"/>

          <p>taskify helps you to keep your brain organized.</p>
        </div>
        <div>
          {!isAuthenticated ? <Button as={Link} to="/login">Get taskify</Button>
            : <Button as={Link} to="/dashboard">Go to Dashboard</Button>
          }
          {!isAuthenticated ? <p>It's free!</p>
            : <p>You are logged in!</p>
          }
        </div>
      </Section>
    );
  }
}

export default Home;