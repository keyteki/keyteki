import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import _ from 'underscore';

import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Register from './Register.jsx';
import Lobby from './Lobby.jsx';
import Decks from './Decks.jsx';
import AddDeck from './AddDeck.jsx';
import NotFound from './NotFound.jsx';

import auth from './auth.js';

var notAuthedMenu = [
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' }
];

var authedMenu = [
    { name: 'Logout', path: '/logout' }
];

var leftMenu = [
    { name: 'Decks', path: '/decks' }
];

class Application extends React.Component {
    constructor() {
        super();

        this.onAuthChanged = this.onAuthChanged.bind(this);
        auth.onChange = this.onAuthChanged;

        this.state = {
            loggedIn: auth.loggedIn()
        };
    }

    onAuthChanged(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        });
    }

    render() {
        var menu = [];
        var leftMenuToRender = [];

        var menuToRender = this.state.loggedIn ? authedMenu : notAuthedMenu;

        _.each(menuToRender, item => {
            var active = item.path === this.props.location.pathname ? 'active' : '';

            menu.push(<li key={ item.name } className={ active }><Link to={ item.path }>{ item.name }</Link></li>);
        });

        _.each(leftMenu, item => {
            var active = item.path === this.props.location.pathname ? 'active' : '';

            leftMenuToRender.push(<li key={ item.name } className={ active }><Link to={ item.path }>{ item.name }</Link></li>);
        });

        return (<div>
            <nav className='navbar navbar-inverse navbar-fixed-top'>
                <div className='container-fluid'>
                    <div className='navbar-header'>
                        <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar' />
                        <span className='sr-only' />
                        <span className='sr-only'>Toggle Navigation</span>
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                    </div>
                </div>
                <Link to='/' className='navbar-brand'>Throneteki</Link>
                <div id='navbar' className='collapse navbar-collapse'>
                    <ul className='nav navbar-nav'>
                        { leftMenuToRender }
                    </ul>
                    <ul className='nav navbar-nav navbar-right'>
                        { menu }
                    </ul>
                </div>
            </nav>
            <div className='container-fluid'>
                { this.props.children }
            </div>
        </div>);
    }
}

if(!window.__karma__) {
    render(<Router history={ browserHistory }>
        <Route path='/' component={ Application }>
            <IndexRoute component={ Lobby } />
            <Route path='register' component={ Register }/>
            <Route path='login' component={ Login } />
            <Route path='logout' component={ Logout } />
            <Route path='decks/add' component={ AddDeck } />
            <Route path='decks' component={ Decks } />
            <Route path='*' component={ NotFound }/>
        </Route>
    </Router>, document.getElementById('component'));
}

Application.displayName = 'Application';
Application.propTypes = {
    children: React.PropTypes.object,
    location: React.PropTypes.object
};

export default Application;
