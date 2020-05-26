import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Link from './Link';
import Avatar from './Avatar';
import * as actions from '../../redux/actions';
import menus from '../../menus';
import i18n from '../../i18n';
import ServerStatus from './ServerStatus';

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.options = [
            {
                name: 'English',
                value: 'en'
            },
            {
                name: 'Español',
                value: 'es'
            },
            {
                name: 'Deutsch',
                value: 'de'
            },
            {
                name: 'Português',
                value: 'pt'
            },
            {
                name: 'Italiano',
                value: 'it'
            },
            {
                name: 'Français',
                value: 'fr'
            },
            {
                name: 'Polski',
                value: 'pl'
            },
            {
                name: 'ไทย',
                value: 'th'
            },
            {
                name: '简体中文',
                value: 'zhhans'
            },
            {
                name: '繁體中文',
                value: 'zhhant'
            }
        ];

        this.state = {};

        this.onLanguageClick = this.onLanguageClick.bind(this);
    }

    componentDidMount() {
        let lang = this.normalizedLanguage();

        i18n.changeLanguage(lang);
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

    onLanguageClick(lang) {
        i18n.changeLanguage(lang.value);
    }

    normalizedLanguage() {
        let lang = i18n.language.replace('-', '').toLowerCase();
        let option = this.options.find((option) => {
            return option.value === lang;
        });

        if (!option) {
            let idx = i18n.language.indexOf('-');
            if (idx !== -1) {
                lang = i18n.language.substring(0, idx).toLowerCase();
            }
        }

        if (lang === 'zh') {
            lang = 'zhhant';
        } else {
            // Try to find again without the '-'
            option = this.options.find((option) => {
                return option.value === lang;
            });

            if (!option) {
                // fallback to english
                lang = 'en';
            }
        }

        return lang;
    }

    renderMenuItem(menuItem) {
        let t = this.props.t;
        let active = menuItem.path === this.props.path ? 'active' : '';

        if (menuItem.showOnlyWhenLoggedOut && this.props.user) {
            return null;
        }

        if (menuItem.showOnlyWhenLoggedIn && !this.props.user) {
            return null;
        }

        if (
            menuItem.permission &&
            (!this.props.user || !this.props.user.permissions[menuItem.permission])
        ) {
            return null;
        }

        if (menuItem.childItems) {
            let className = 'dropdown';

            if (
                menuItem.childItems.some((item) => {
                    return item.path === this.props.path;
                })
            ) {
                className += ' active';
            }

            var childItems = menuItem.childItems.reduce((items, item) => {
                if (
                    item.permission &&
                    (!this.props.user || !this.props.user.permissions[item.permission])
                ) {
                    return items;
                }

                return items.concat(
                    <li key={item.title}>
                        <Link href={item.path}>{t(item.title)}</Link>
                    </li>
                );
            }, []);

            if (childItems.length === 0) {
                return null;
            }

            return (
                <li key={menuItem.title} className={className}>
                    <a
                        href='#'
                        className='dropdown-toggle'
                        data-toggle='dropdown'
                        role='button'
                        aria-haspopup='true'
                        aria-expanded='false'
                    >
                        {menuItem.showProfilePicture && this.props.user ? (
                            <Avatar username={this.props.user.username} />
                        ) : null}
                        {menuItem.showProfilePicture && this.props.user
                            ? this.props.user.username
                            : t(menuItem.title)}
                        <span className='caret' />
                    </a>
                    <ul className='dropdown-menu'>{childItems}</ul>
                </li>
            );
        }

        return (
            <li key={menuItem.title} className={active}>
                <Link href={menuItem.path}>{t(menuItem.title)}</Link>
            </li>
        );
    }

    render() {
        let t = this.props.t;

        let leftMenu = menus.filter((menu) => {
            return menu.position === 'left';
        });
        let rightMenu = menus.filter((menu) => {
            return menu.position === 'right';
        });

        let leftMenuToRender = leftMenu.map(this.renderMenuItem.bind(this));
        let rightMenuToRender = rightMenu.map(this.renderMenuItem.bind(this));

        let languageDropdown = (
            <li className='dropdown'>
                <a
                    href='#'
                    className='dropdown-toggle'
                    data-toggle='dropdown'
                    role='button'
                    aria-haspopup='true'
                    aria-expanded='false'
                >
                    {i18n.language}
                    <span className='caret' />
                </a>
                <ul className='dropdown-menu'>
                    {this.options.map((item) => (
                        <li key={item.value}>
                            <a href='#' onClick={() => this.onLanguageClick(item)}>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </li>
        );

        let numGames = this.props.games ? (
            <li>
                <span>{t('{{gameLength}} Games', { gameLength: this.props.games.length })}</span>
            </li>
        ) : null;

        let contextMenu =
            this.props.context &&
            this.props.context.map((menuItem) => {
                return (
                    <li key={menuItem.text}>
                        <a
                            href='javascript:void(0)'
                            onMouseOver={this.onMenuItemMouseOver.bind(this, menuItem)}
                            onMouseOut={this.onMenuItemMouseOut.bind(this)}
                            onClick={
                                menuItem.onClick
                                    ? (event) => {
                                          event.preventDefault();
                                          menuItem.onClick();
                                      }
                                    : null
                            }
                        >
                            {t(menuItem.text, menuItem.values)}
                        </a>
                        {this.state.showPopup === menuItem ? this.state.showPopup.popup : null}
                    </li>
                );
            });

        return (
            <nav className='navbar navbar-inverse navbar-fixed-top navbar-sm'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button
                            className='navbar-toggle collapsed'
                            type='button'
                            data-toggle='collapse'
                            data-target='#navbar'
                            aria-expanded='false'
                            aria-controls='navbar'
                        >
                            <span className='sr-only'>Toggle Navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link href='/' className='navbar-brand' />
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav'>{leftMenuToRender}</ul>
                        <ul className='nav navbar-nav navbar-right'>
                            {contextMenu}
                            {numGames}
                            {!this.props.currentGame && (
                                <ServerStatus
                                    connected={this.props.lobbySocketConnected}
                                    connecting={this.props.lobbySocketConnecting}
                                    serverType='Lobby'
                                    responseTime={this.props.lobbyResponse}
                                />
                            )}
                            {this.props.currentGame && (
                                <ServerStatus
                                    connected={this.props.gameConnected}
                                    connecting={this.props.gameConnecting}
                                    serverType='Game server'
                                    responseTime={this.props.gameResponse}
                                />
                            )}
                            {rightMenuToRender}
                            {languageDropdown}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
    context: PropTypes.array,
    currentGame: PropTypes.object,
    gameConnected: PropTypes.bool,
    gameConnecting: PropTypes.bool,
    gameResponse: PropTypes.number,
    games: PropTypes.array,
    i18n: PropTypes.object,
    lobbyResponse: PropTypes.number,
    lobbySocketConnected: PropTypes.bool,
    lobbySocketConnecting: PropTypes.bool,
    path: PropTypes.string,
    t: PropTypes.func,
    title: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        context: state.navigation.context,
        currentGame: state.lobby.currentGame,
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        gameResponse: state.games.responseTime,
        games: state.lobby.games,
        lobbyResponse: state.lobby.responseTime,
        lobbySocketConnected: state.lobby.connected,
        lobbySocketConnecting: state.lobby.connecting,
        path: state.navigation.path,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(NavBar));
