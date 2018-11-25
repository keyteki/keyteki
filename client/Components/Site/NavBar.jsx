import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from './Link';
import Avatar from './Avatar';
import * as actions from '../../actions';
import menus from '../../menus';

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onMenuItemMouseOver(menuItem) {
        this.setState({
            showPopup: menuItem
        });
    }

    onMenuItemMouseOut() {
        this.setState({
            showPopup: undefined
        });
    }

    renderMenuItem(menuItem) {
        let active = menuItem.path === this.props.path ? 'active' : '';

        if(menuItem.showOnlyWhenLoggedOut && this.props.user) {
            return null;
        }

        if(menuItem.showOnlyWhenLoggedIn && !this.props.user) {
            return null;
        }

        if(menuItem.permission && (!this.props.user || !this.props.user.permissions[menuItem.permission])) {
            return null;
        }

        if(menuItem.childItems) {
            let className = 'dropdown';

            if(menuItem.childItems.some(item => {
                return item.path === this.props.path;
            })) {
                className += ' active';
            }

            var childItems = menuItem.childItems.reduce((items, item) => {
                if(item.permission && (!this.props.user || !this.props.user.permissions[item.permission])) {
                    return items;
                }

                return items.concat(<li key={ item.title }><Link href={ item.path }>{ item.title }</Link></li>);
            }, []);

            if(childItems.length === 0) {
                return null;
            }

            return (
                <li key={ menuItem.title } className={ className }>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                        { menuItem.showProfilePicture && this.props.user ?
                            <Avatar username={ this.props.user.username } /> :
                            null }
                        { menuItem.showProfilePicture && this.props.user ? this.props.user.username : menuItem.title }<span className='caret' />
                    </a>
                    <ul className='dropdown-menu'>
                        { childItems }
                    </ul>
                </li>);
        }

        return <li key={ menuItem.title } className={ active }><Link href={ menuItem.path }>{ menuItem.title }</Link></li>;
    }

    render() {
        let leftMenu = menus.filter(menu => {
            return menu.position === 'left';
        });
        let rightMenu = menus.filter(menu => {
            return menu.position === 'right';
        });

        let leftMenuToRender = leftMenu.map(this.renderMenuItem.bind(this));
        let rightMenuToRender = rightMenu.map(this.renderMenuItem.bind(this));

        let numGames = this.props.games ? <li><span>{ `${this.props.games.length} Games` }</span></li> : null;

        let contextMenu = this.props.context && this.props.context.map(menuItem => {
            return (
                <li key={ menuItem.text }><a href='javascript:void(0)' onMouseOver={ this.onMenuItemMouseOver.bind(this, menuItem) }
                    onMouseOut={ this.onMenuItemMouseOut.bind(this) }
                    onClick={ menuItem.onClick ? event => {
                        event.preventDefault();
                        menuItem.onClick();
                    } : null }>{ menuItem.text }</a>{ (this.state.showPopup === menuItem) ? this.state.showPopup.popup : null }</li>
            );
        });

        let className = 'glyphicon glyphicon-signal';
        let toolTip = 'Lobby is';

        if(this.props.lobbySocketConnected) {
            className += ' text-success';
            toolTip += ' connected';
        } else if(this.props.lobbySocketConnecting) {
            className += ' text-primary';
            toolTip += ' connecting';
        } else {
            className += ' text-danger';
            toolTip += ' disconnected';
        }

        let lobbyStatus = (
            <li>
                <span className={ className } title={ toolTip } />
            </li>);

        className = 'glyphicon glyphicon-signal';
        toolTip = 'Game server is';
        if(this.props.currentGame) {
            if(this.props.gameConnected) {
                className += ' text-success';
                toolTip += ' connected';
            } else if(this.props.gameConnecting) {
                className += ' text-primary';
                toolTip += ' connecting';
            } else {
                className += ' text-danger';
                toolTip += ' disconnected';
            }
        } else {
            toolTip += ' not needed at this time';
        }

        let gameStatus = (
            <li>
                <span className={ className } title={ toolTip } />
            </li>);

        return (
            <nav className='navbar navbar-inverse navbar-fixed-top navbar-sm'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                            <span className='sr-only'>Toggle Navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link href='/' className='navbar-brand'>{ this.props.title }</Link>
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            { leftMenuToRender }
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            { contextMenu }
                            { numGames }
                            { lobbyStatus }
                            { gameStatus }
                            { rightMenuToRender }
                        </ul>
                    </div>
                </div>
            </nav>);
    }
}

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
    context: PropTypes.array,
    currentGame: PropTypes.object,
    gameConnected: PropTypes.bool,
    gameConnecting: PropTypes.bool,
    games: PropTypes.array,
    lobbySocketConnected: PropTypes.bool,
    lobbySocketConnecting: PropTypes.bool,
    path: PropTypes.string,
    title: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        context: state.navigation.context,
        currentGame: state.lobby.currentGame,
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        games: state.lobby.games,
        lobbySocketConnected: state.lobby.connected,
        lobbySocketConnecting: state.lobby.connecting,
        path: state.navigation.path,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(NavBar);
