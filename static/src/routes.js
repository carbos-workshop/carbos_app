/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import  { ExploreContainer } from './containers/ExploreContainer';
import  LoginContainer  from './containers/LoginContainer';
// import LoginView from './components/LoginView';
// import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import Analytics from './components/Analytics';
import NotFound from './components/NotFound';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';


    // <Route path="login" component={requireNoAuthentication(LoginView)} />
    // <Route path="register" component={requireNoAuthentication(RegisterView)} />

export default (
	<div>
		<Route path="/welcome" component={requireNoAuthentication(LoginContainer)} />
		<Route path="/" component={App}>
				<Route path="main" component={requireAuthentication(ProtectedView)} />
				<Route path="explore" component={requireNoAuthentication(ExploreContainer)} />
				<Route path="analytics" component={requireAuthentication(Analytics)} />
				<Route path="*" component={DetermineAuth(NotFound)} />
		</Route>
    </div>
);
