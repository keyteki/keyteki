import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import NavbarItem from './NavbarItem';
import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';

import './Navigation.scss';
import Link from './Link';

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
     * Filter a list of menu items to what the logged in user can see
     * @param {MenuItem[]} menuItems The list of menu items
     * @param {User} user The logged in user
     * @returns {MenuItem[]} The filtered menu items
     */
    const filterMenuItems = (menuItems, user) =>
        menuItems.filter(
            (item) =>
                (user && !item.showOnlyWhenLoggedOut) ||
                (!user && item.showOnlyWhenLoggedIn) ||
                (item.permission && user && user.permissions[item.permission])
        );

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
                    <NavbarItem
                        key={menuItem.title}
                        title={t(menuItem.title)}
                        childLinks={children}
                    />
                );
            }

            if (!menuItem.path) {
                return <></>;
            }

            return (
                <NavbarItem key={menuItem.title} href={menuItem.path} title={t(menuItem.title)} />
            );
        });
    };

    const numGames = games && <NavbarItem title={`${t(`${games.length} Games`)}`} />;

    return (
        <div className={'top-navbar'}>
            {renderMenuItems(LeftMenu)}
            <Link href={'/'} classname={'navbar-brand'} />
            <div className={'navbar-right'}>
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
            </div>
        </div>
    );
};

export default Navigation;
