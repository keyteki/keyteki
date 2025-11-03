import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';

import Link from './Link';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Image,
    Navbar,
    NavbarContent,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarMenu
} from '@heroui/react';
import NavItem from './NavItem';
import NavigationLink from '../Site/NavigationLink';

import HeaderIcon from '../../assets/img/main_header_logo.png';
import SmallHeaderIcon from '../../assets/img/header_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    const filterMenuItems = useCallback(
        (menuItems, user) => {
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
        },
        [userCanSeeMenu]
    );

    /**
     * Render a list of menu items to react components
     * @param {MenuItem[]} menuItems The menu items
     * @returns {JSX.Element[]} The list of rendered menu items
     */
    const renderMenuItems = useCallback(
        (menuItems) => {
            return filterMenuItems(menuItems, props.user).map((menuItem) => {
                const children =
                    menuItem.childItems && filterMenuItems(menuItem.childItems, props.user);

                if (children && children.length > 0) {
                    return (
                        <Dropdown key={menuItem.title} placement='bottom-start'>
                            <DropdownTrigger>
                                <NavItem className='flex gap-1'>
                                    {t(menuItem.title)}
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </NavItem>
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
                                                className='m-2 p-0 block no-underline text-white/80 hover:text-white transition-colors duration-300 font-[PoppinsMedium]'
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
                        <Link
                            className='px-3 py-1 no-underline text-white/80 hover:text-white transition-colors duration-300 font-[PoppinsMedium]'
                            href={menuItem.path}
                        >
                            {t(menuItem.title)}
                        </Link>
                    </li>
                );
            });
        },
        [props.user, t, filterMenuItems]
    );

    let leftMenu = useMemo(() => {
        return renderMenuItems(LeftMenu);
    }, [renderMenuItems]);

    let rightMenu = useMemo(() => {
        return renderMenuItems(RightMenu);
    }, [renderMenuItems]);

    let numGames = games ? (
        <li className='font-[PoppinsMedium] text-white text-nowrap'>
            <span>{`${games.length} Games`}</span>
        </li>
    ) : null;

    return (
        <Navbar isBordered height='3rem' maxWidth='full' isMenuOpen={isMenuOpen} className='z-0'>
            <NavbarContent className='lg:hidden' justify='start'>
                <NavbarMenuToggle onChange={(isOpen) => setIsMenuOpen(isOpen)} />
            </NavbarContent>
            <NavbarContent className='lg:hidden' justify='center'>
                <NavbarBrand as={NavigationLink} href='/'>
                    <img
                        src={SmallHeaderIcon}
                        width='32'
                        height='32'
                        className='inline-block align-top'
                        alt='TCO Logo'
                    />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className='lg:hidden' justify='end'>
                {rightMenu}
                <ProfileDropdown menu={ProfileMenu} user={props.user} />
                <LanguageSelector />
            </NavbarContent>
            <NavbarMenu>
                {leftMenu}
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
                <GameContextMenu
                // onPress={(showConfirmLeave) => {
                //     setIsMenuOpen(false);
                //     setShowConfirmLeave(showConfirmLeave);
                // }}
                />
            </NavbarMenu>
            <NavbarContent className='hidden lg:flex' justify='start'>
                {leftMenu}
            </NavbarContent>
            <NavbarContent className='hidden lg:flex' justify='center'>
                <NavbarBrand as={NavigationLink} href='/'>
                    <Image
                        src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                        style={{ height: '48px' }}
                        alt='TCO Logo'
                    />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className='hidden lg:flex' justify='end'>
                <GameContextMenu
                // onPress={(showConfirmLeave) => {
                //     setIsMenuOpen(false);
                //     setShowConfirmLeave(showConfirmLeave);
                // }}
                />
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
                {rightMenu}
                <ProfileDropdown menu={ProfileMenu} user={props.user} />
            </NavbarContent>
        </Navbar>
    );
};

export default Navigation;
