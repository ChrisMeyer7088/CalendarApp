import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, Link, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomePage from './pages/home/home';

const routing = (
    <Router>
        <Route path='/home' render = {() => <HomePage />} />
        <Redirect from='**' to="/home" />
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
