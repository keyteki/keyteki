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

import HeaderIcon from '../../assets/img/main_header_logo.png';
import SmallHeaderIcon from '../../assets/img/header_icon.png';

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

            if (children && children.length > 0) {
                return (
                    <NavDropdown
                        key={menuItem.title}
                        id={`nav-${menuItem.title}`}
                        title={t(menuItem.title)}
                    >
                        {children.map((childItem) =>
                            childItem.path ? (
                                <NavDropdown.Item
                                    as={Link}
                                    href={childItem.path}
                                    className='navbar-item interactable dropdown-child'
                                >
                                    {t(childItem.title)}
                                </NavDropdown.Item>
                            ) : null
                        )}
                    </NavDropdown>
                );
            }

            if (!menuItem.path) {
                return <></>;
            }
            return (
                <li key={menuItem.title}>
                    <Nav.Link className='navbar-item interactable' as={Link} href={menuItem.path}>
                        {t(menuItem.title)}
                    </Nav.Link>
                </li>
            );
        });
    };

    const numGames = games && (
        <li className='navbar-item'>
            <span>{`${t(`${games.length} Games`)}`}</span>
        </li>
    );

    return (
        <Navbar bg='dark' variant='dark' className='navbar-sm' fixed='top' expand='lg'>
            <Navbar.Brand
                className='navbar-brand bg-dark ml-auto mr-auto d-lg-none'
                as={Link}
                href='/'
            >
                <img
                    src={SmallHeaderIcon}
                    height='32'
                    className='d-inline-block align-top'
                    alt='TCO Logo'
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='navbar' />
            <Navbar.Collapse id='navbar'>
                <Nav className='me-auto mb-2 mb-lg-0 bg-dark'>{renderMenuItems(LeftMenu)}</Nav>
                <Navbar.Brand
                    className='navbar-brand bg-dark ml-auto mr-auto d-none d-lg-block'
                    as={Link}
                    href='/'
                >
                    <img
                        src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                        height='32'
                        className='d-inline-block align-top'
                        alt='TCO Logo'
                    />
                </Navbar.Brand>
                <Nav className='pr-xl-5 bg-dark'>
                    <GameContextMenu />
                    {!currentGame?.started && numGames}
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
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
