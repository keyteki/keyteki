import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Register from './Register.jsx';
import Lobby from './Lobby.jsx';
import Decks from './Decks.jsx';
import AddDeck from './AddDeck.jsx';
import NotFound from './NotFound.jsx';
import Link from './Link.jsx';

import * as actions from './actions';

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

class App extends React.Component {
    componentWillMount() {
        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 401) {
                this.props.navigate('/login');
            }
        });
    }

    render() {
        var menu = [];
        var leftMenuToRender = [];
        var menuToRender = this.props.loggedIn ? authedMenu : notAuthedMenu;
        var component = {};
        
        switch(this.props.path) {
            case '/':
                component = <Lobby />;
                break;
            case '/login':
                component = <Login />;
                break;
            case '/logout':
                component = <Logout />;
                break;
            case '/register':
                component = <Register />;
                break;
            case '/decks':
                component = <Decks />;
                break;
            case '/decks/add':
                component = <AddDeck />;
                break;
            default:
                component = <NotFound />;
                break;
        }

        _.each(menuToRender, item => {
            var active = item.path === this.props.path ? 'active' : '';

            menu.push(<li key={ item.name } className={ active }><Link href={ item.path }>{ item.name }</Link></li>);
        });

        _.each(leftMenu, item => {
            var active = item.path === this.props.path ? 'active' : '';

            leftMenuToRender.push(<li key={ item.name } className={ active }><Link href={ item.path }>{ item.name }</Link></li>);
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
                <Link href='/' className='navbar-brand'>Throneteki</Link>
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
                { component }
            </div>
        </div>);
    }
}

App.displayName = 'Application';
App.propTypes = {
    loggedIn: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    path: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        path: state.navigation.path,
        loggedIn: state.auth.loggedIn
    };
}

const Application = connect(mapStateToProps, actions)(App);

export default Application;
