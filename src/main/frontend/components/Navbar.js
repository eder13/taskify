import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadingBooleanSelector, loadLogout} from "../store/auth/auth";
import styled, {keyframes} from "styled-components";

const NavbarWrapper = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 56px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: lightblue;
  color: rgb(34, 27, 113);
  z-index: 10;
`;

const Logo = styled.div`
  padding: 0.5rem 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: rgb(34, 27, 113);
  font-size: 1.3rem;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 500;
`;

const animate = keyframes`
  from {
    opacity: 0;
  }
  
  to {
    opacity: 1;
  }
`;

const DesktopNav = styled.nav`
  display: none;
  @media only screen and (min-width: 800px) {
    display: flex;
    flex-flow: row nowrap;
    width: 400px;
    
    & ul {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      
      & li {
        display: flex;
        flex-flow: row nowrap;
        flex: 1;
        justify-content: space-evenly;
        
        & ${StyledLink} {
          font-size: 1rem;
        }
      }
    }
  }
`;

const Nav = styled.nav`
  @media only screen and (min-width: 800px) {
    display: none;
  }

  position: fixed;
  top: 56px;
  right: 15px;
  width: 30%;
  height: 100px;
  border-radius: 10px;
  z-index: 2;
  display: none;
  animation: ${animate} 0.5s forwards ease-in;
  justify-content: center;
  align-items: center;
  background-color: rgb(229, 246, 249);
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    right: 31px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid black;
  }
  
  & ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    
    & li {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      border: 1px solid lightblue;
      flex: 1;
      
      &:first-child {
        border-radius: 10px 10px 0 0;
      }      
      
      &:last-child {
        border-radius: 0px 0px 10px 10px;
      }
      
      & ${StyledLink} {
        font-size: 1.0rem;
      }
    }
  }
`;

const HamburgerToggle = styled.input`
  @media only screen and (min-width: 800px) {
    display: none;
  }


  &:checked ~ ${Nav} {
    display: flex;
    @media only screen and (min-width: 800px) {
      display: none;
    }
  }
  
  position: fixed;
  right: 14px;
  width: 42px;
  height: 40px;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
  margin-right: 1rem;
`;

const Hamburger = styled.div`
  @media only screen and (min-width: 800px) {
    display: none;
  }

  width: 42px;
  height: 40px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
  border-radius: 50%;
  box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.1);
  margin-right: 0.9rem;

  & > div {
    width: 50%;
    height: 2px;
    outline: 0.5px solid black;
    background-color: black;
    position: relative;
    transition: all 0.2s ease-in-out;
    
    &:before {
      content: "";
      position: absolute;
      background-color: black;
      top: -8px;
      width: 100%;
      height: 2px;
      outline: 0.5px solid black;
    }

    &:after {
      content: "";
      position: absolute;
      background-color: black;
      top: 8px;
      width: 100%;
      height: 2px;
      outline: 0.5px solid black;
    }
  }
  
  ${HamburgerToggle}:checked + & > div {
    transform: rotate(135deg);
    
    &:before, &:after {
      top: 0;
      transform: rotate(90deg);
    }
  }
`;

const Navbar = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector(loadingBooleanSelector);

  // keeps sure that nav is closed when nav element was clicked
  const handleMenu = (e) => {
    if (e.target.classList.contains('innerLink')) {

      // hide the navbar by
      const checkBox = e.target.parentElement.parentElement.parentElement.parentElement.children.namedItem('hamburgerCheckbox');
      checkBox.checked = false;

    }
  }

  if (!loading) {
    return (
      <NavbarWrapper>
        <Logo>
          <StyledLink as="a" href="/">{props.title}</StyledLink>
        </Logo>

        <DesktopNav>
          <ul>
            <li><StyledLink to="/">home</StyledLink></li>
            <li><StyledLink to={props.dash}>{props.dash.replace("/", "")}</StyledLink></li>
            {props.logout &&
            <li>
              <button style={{padding: '0 0.5rem'}} onClick={
                () => {
                  dispatch(loadLogout()).then((resolve) => {
                    if (resolve)
                      window.location.href = "/";
                  });
                }}>
                <i className="fas fa-sign-out-alt"/>
              </button>
            </li>}
          </ul>
        </DesktopNav>

        <HamburgerToggle id="hamburgerCheckbox" type="checkbox"/>
        <Hamburger>
          <div>{}</div>
        </Hamburger>
        <Nav>
          <ul onClick={handleMenu}>
            <li><StyledLink className="innerLink" to="/">home</StyledLink></li>
            <li><StyledLink className="innerLink" to={props.dash}>{props.dash.replace("/", "")}</StyledLink></li>
            {props.logout &&
            <li>
              <button style={{padding: '0 0.5rem'}} onClick={
                () => {
                  dispatch(loadLogout()).then((resolve) => {
                    if (resolve)
                      window.location.href = "/";
                  });
                }}>
                <i className="fas fa-sign-out-alt"/>
              </button>
            </li>}
          </ul>
        </Nav>
      </NavbarWrapper>
    );
  } else {
    return <Fragment>{}</Fragment>;
  }
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  dash: PropTypes.string.isRequired,
  logout: PropTypes.bool.isRequired,
};

export default Navbar;