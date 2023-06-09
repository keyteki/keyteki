import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';

import './Navigation.scss';
import Link from './Link';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

/**
 * @typedef { import('../../menus').MenuItem } MenuItem
 */

/**
 * @typedef NavigationProps
 * @property {string} appName The name of the application, displayed on the left hand side of the navbar
 * @property {User} user The currently logged in user
 */

/**
 * @param {NavigationProps} props
 */
const Navigation = (props) => {
    const { t } = useTranslation();
    const {
        gameConnected,
        gameConnecting,
        gameResponse,
        games,
        currentGame,
        lobbyResponse,
        lobbySocketConnected,
        lobbySocketConnecting
    } = useSelector(
        (state) => ({
            gameConnected: state.games.connected,
            gameConnecting: state.games.connecting,
            gameResponse: state.games.responseTime,
            games: state.lobby.games,
            currentGame: state.lobby.currentGame,
            lobbyResponse: state.lobby.responseTime,
            lobbySocketConnected: state.lobby.connected,
            lobbySocketConnecting: state.lobby.connecting
        }),
        null
    );

    /**
     * @param {MenuItem} menuItem The menu item
     * @param {User} user The logged in user
     * @returns {boolean} Whether or not the user can see this menu item
     */
    const userCanSeeMenu = (menuItem, user) => {
        return !menuItem.permission || (!!user && user.permissions[menuItem.permission]);
    };

    /**
     * Filter a list of menu items to what the logged in user can see
     * @param {MenuItem[]} menuItems The list of menu items
     * @param {User} user The logged in user
     * @returns {MenuItem[]} The filtered menu items
     */
    const filterMenuItems = (menuItems, user) => {
        const returnedItems = [];

        for (const menuItem of menuItems) {
            if (user && menuItem.showOnlyWhenLoggedOut) {
                continue;
            }

            if (!user && menuItem.showOnlyWhenLoggedIn) {
                continue;
            }

            if (!userCanSeeMenu(menuItem, user)) {
                continue;
            }

            returnedItems.push(menuItem);
        }

        return returnedItems;
    };

    /**
     * Render a list of menu items to react components
     * @param {MenuItem[]} menuItems The menu items
     * @returns {JSX.Element[]} The list of rendered menu items
     */
    const renderMenuItems = (menuItems) => {
        return filterMenuItems(menuItems, props.user).map((menuItem) => {
            const children =
                menuItem.childItems && filterMenuItems(menuItem.childItems, props.user);

            return children && children.length > 0 ? (
                <NavDropdown
                    key={menuItem.title}
                    id={`nav-${menuItem.title}`}
                    title={t(menuItem.title)}
                >
                    {children.map((childItem) =>
                        childItem.path ? (
                            <Link key={childItem.path} href={childItem.path}>
                                <NavDropdown.Item
                                    className={'navbar-item interactable dropdown-child'}
                                >
                                    {t(childItem.title)}
                                </NavDropdown.Item>
                            </Link>
                        ) : null
                    )}
                </NavDropdown>
            ) : (
                <Link key={menuItem.title} href={menuItem.path}>
                    <Nav.Link className={'navbar-item interactable'}>{t(menuItem.title)}</Nav.Link>
                </Link>
            );
        });
    };

    const numGames = games && (
        <div className='navbar-item mr-1'>{`${t(`${games.length} Games`)}`}</div>
    );

    return (
        <Navbar className='navbar-sm navbar-color' fixed='top'>
            <Nav>{renderMenuItems(LeftMenu)}</Nav>
            <Link href={'/'}>
                <Navbar.Brand />
            </Link>
            <Navbar.Collapse id='navbar' className='justify-content-end'>
                <GameContextMenu />
                {numGames}
                {currentGame?.started ? (
                    <ServerStatus
                        connected={gameConnected}
                        connecting={gameConnecting}
                        serverType='Game server'
                        responseTime={gameResponse}
                    />
                ) : (
                    <ServerStatus
                        connected={lobbySocketConnected}
                        connecting={lobbySocketConnecting}
                        serverType='Lobby'
                        responseTime={lobbyResponse}
                    />
                )}
                {renderMenuItems(RightMenu)}
                <ProfileDropdown menu={ProfileMenu} user={props.user} />
                <LanguageSelector />
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
