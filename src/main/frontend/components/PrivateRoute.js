import React from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import {loadingBooleanSelector, loginIsAuthenticatedSelector} from "../store/auth/auth";

const PrivateRoute = ({component: Component, ...rest}) => {

  // check if the user is authenticated and not loading anymore (process while info is fetched)
  const isAuthenticated = useSelector(loginIsAuthenticatedSelector);
  const loading = useSelector(loadingBooleanSelector);

  return (
    <Route {...rest}
           render={
             props => (!isAuthenticated && !loading) ?
               <Redirect to="/login"/> :
               <Component {...props} />
           }
    />);
}

export default PrivateRoute;