import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';
import { sendLeaveGame } from '../../redux/slices/lobbySlice';

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
    NavbarMenu,
    NavbarMenuItem
} from '@heroui/react';
import FullScreenButton from './FullScreenButton';
import NavItem from './NavItem';
import ConfirmDialog from '../Site/ConfirmDialog';
import NavigationLink from '../Site/NavigationLink';

import HeaderIcon from '../../assets/img/main_header_logo.png';
import SmallHeaderIcon from '../../assets/img/header_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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
    const [showConfirmLeave, setShowConfirmLeave] = useState(false);
    const [dropdownOpenStatus, setDropdownOpenStatus] = useState({});

    const userCanSeeMenu = (menuItem, user) => {
        return !menuItem.permission || (!!user && user.permissions[menuItem.permission]);
    };

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

    const renderMenuItems = useCallback(
        (menuItems) => {
            return filterMenuItems(menuItems, user).map((menuItem, index) => {
                const children = menuItem.childItems && filterMenuItems(menuItem.childItems, user);

                if (children && children.length > 0) {
                    return (
                        <Dropdown
                            key={menuItem.title || index}
                            onOpenChange={(isOpen) => {
                                const newDropDownStatus = Object.assign({}, dropdownOpenStatus);
                                newDropDownStatus[menuItem.title || index] = isOpen;

                                setDropdownOpenStatus(newDropDownStatus);
                            }}
                        >
                            <DropdownTrigger>
                                <NavItem className='flex gap-1'>
                                    {menuItem.title}
                                    <FontAwesomeIcon
                                        icon={
                                            dropdownOpenStatus[menuItem.title || index]
                                                ? faChevronUp
                                                : faChevronDown
                                        }
                                    />
                                </NavItem>
                            </DropdownTrigger>
                            <DropdownMenu
                                id={`nav-${menuItem.title}`}
                                variant='flat'
                                className='font-[PoppinsMedium] text-secondary'
                                title={menuItem.title}
                            >
                                {children.map((childItem) =>
                                    childItem.path ? (
                                        <DropdownItem
                                            key={childItem.title}
                                            classNames={{ base: 'flex' }}
                                            onPointerDown={() => setIsMenuOpen(false)}
                                            textValue={childItem.title}
                                        >
                                            <NavItem
                                                className='w-full'
                                                size='md'
                                                path={childItem.path}
                                            >
                                                {childItem.title}
                                            </NavItem>
                                        </DropdownItem>
                                    ) : null
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    );
                }

                if (!menuItem.path) {
                    return <React.Fragment key={index}></React.Fragment>;
                }

                return (
                    <NavbarMenuItem key={index} onPointerDown={() => setIsMenuOpen(false)}>
                        <NavItem className='w-full' path={menuItem.path}>
                            {menuItem.title}
                        </NavItem>
                    </NavbarMenuItem>
                );
            });
        },
        [user, t, filterMenuItems]
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
        <>
            <Navbar
                isBordered
                height='3rem'
                maxWidth='full'
                isMenuOpen={isMenuOpen}
                className='z-0'
            >
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
                    <FullScreenButton />

                    <ProfileDropdown menu={ProfileMenu} user={user} />
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
                        onPress={(showConfirmLeave) => {
                            setIsMenuOpen(false);
                            setShowConfirmLeave(showConfirmLeave);
                        }}
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
                        onPress={(showConfirmLeave) => {
                            setIsMenuOpen(false);
                            setShowConfirmLeave(showConfirmLeave);
                        }}
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
                    <ProfileDropdown menu={ProfileMenu} user={user} />
                    <LanguageSelector />
                </NavbarContent>
            </Navbar>
            <ConfirmDialog
                isOpen={showConfirmLeave}
                message='Your game is not finished, and you will automatically concede when leaving. Are you sure you want to leave?'
                onOpenChange={setShowConfirmLeave}
                onCancel={() => setShowConfirmLeave(false)}
                onOk={async () => {
                    dispatch(sendLeaveGame());
                }}
            />
        </>
    );
};

export default Navigation;
