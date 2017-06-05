import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { store, load, ids } from '../storage';
import { createLoggedIn } from '../actions';
import authService from './authService';
import LoginForm from './loginForm.jsx';

export const LoginComponent = ({
  location: {
    from,
    hash,
  },
  loggedIn,
}) => {
  if (!authService.loggedIn()) {
    if (/access_token|id_token|error/.test(hash)) {
      authService.handleAuthentication(loggedIn);
    } else if (from) {
      store(ids.REDIRECT_URI, from.pathname);
    } else {
      store(ids.REDIRECT_URI, '/');
    }

    return <LoginForm dispatchLoggedIn={loggedIn} />;
  }

  return (
    <Redirect
      to={{
        pathname: load(ids.REDIRECT_URI) || '/',
      }}
    />
  );
};

LoginComponent.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    from: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  }).isRequired,
  loggedIn: PropTypes.func.isRequired,
};

export default withRouter(connect(
  () => ({}),
  dispatch => ({
    loggedIn(tokenPayload) {
      dispatch(createLoggedIn(tokenPayload));
    },
  }),
)(LoginComponent));
