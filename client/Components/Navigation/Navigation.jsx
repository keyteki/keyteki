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
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';

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
    } = useSelector((state) => ({
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        gameResponse: state.games.responseTime,
        games: state.lobby.games,
        currentGame: state.lobby.currentGame,
        lobbyResponse: state.lobby.responseTime,
        lobbySocketConnected: state.lobby.connected,
        lobbySocketConnecting: state.lobby.connecting
    }));

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
                    <Dropdown key={menuItem.title} placement='bottom-start'>
                        <DropdownTrigger>
                            <Button variant='light' className='bg-transparent text-foreground'>
                                {t(menuItem.title)}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label={t(menuItem.title)}>
                            {children.map((childItem) =>
                                childItem.path ? (
                                    <DropdownItem
                                        key={childItem.path}
                                        textValue={t(childItem.title)}
                                    >
                                        <Link
                                            href={childItem.path}
                                            className='navbar-item interactable dropdown-child'
                                        >
                                            {t(childItem.title)}
                                        </Link>
                                    </DropdownItem>
                                ) : null
                            )}
                        </DropdownMenu>
                    </Dropdown>
                );
            }

            if (!menuItem.path) {
                return <></>;
            }
            return (
                <li key={menuItem.title}>
                    <Link className='navbar-item interactable' href={menuItem.path}>
                        {t(menuItem.title)}
                    </Link>
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
        <nav className='navbar-sm fixed top-0 left-0 right-0 bg-dark text-foreground z-50'>
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between py-2'>
                    <ul className='flex items-center gap-4'>{renderMenuItems(LeftMenu)}</ul>

                    <Link href='/' className='navbar-brand hidden lg:block'>
                        <img
                            src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                            height='32'
                            className='d-inline-block align-top'
                            alt='TCO Logo'
                        />
                    </Link>

                    <ul className='flex items-center gap-4 text-nowrap'>
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
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
