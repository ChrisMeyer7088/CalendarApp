import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomePage from './pages/home/home';
import LoginPage from './pages/login/login';
import RegistrationPage from './pages/register/register';
import RetrieveAccountPage from './pages/retrieveAccount/retrieveAccount';
import AccountPage from './pages/account/account';

const routing = (
    <Router>
        <Switch>
            <Route path='/home' render = {() => <HomePage />} />
            <Route path='/login' render = {() => <LoginPage />} />
            <Route path='/register' render = {() => <RegistrationPage />} />
            <Route path='/password-reset' render = {() => <RetrieveAccountPage />} />
            <Route path='/account' render={() => <AccountPage />} />
            <Route render = {() => <Redirect to={{pathname:"/home"}} />} />
        </Switch>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
