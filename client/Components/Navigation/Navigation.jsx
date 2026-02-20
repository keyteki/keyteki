import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button as HeroButton, Dropdown, Label } from '@heroui/react';
import Icon from '../Icon';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';
import Link from './Link';

import HeaderIcon from '../../assets/img/main_header_logo.png';
import HeaderIconLight from '../../assets/img/main_header_logo_light.png';
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
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdownKey, setOpenDropdownKey] = useState('');
    const [isLightTheme, setIsLightTheme] = useState(false);
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

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const htmlEl = document.documentElement;
        const setThemeState = () => {
            const dataTheme = htmlEl.getAttribute('data-theme');
            setIsLightTheme(dataTheme === 'light' || htmlEl.classList.contains('light'));
        };

        setThemeState();

        const observer = new MutationObserver(setThemeState);
        observer.observe(htmlEl, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const navTextClass =
        'inline-flex h-9 items-center px-3 text-sm font-medium text-foreground lg:h-12';
    const navLinkClass =
        'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-amber-600 dark:text-amber-300 transition hover:bg-surface-secondary/55 hover:text-amber-700 dark:hover:text-amber-200 lg:h-12';
    const navLinkActiveClass =
        'bg-[color:color-mix(in_oklab,var(--brand)_18%,var(--surface))] text-[color:color-mix(in_oklab,var(--brand)_82%,black)] dark:bg-accent/24 dark:text-amber-100 ring-1 ring-[color:color-mix(in_oklab,var(--brand)_42%,transparent)]';
    const navDropdownTriggerClass =
        '!inline-flex !h-9 !min-w-0 !items-center !gap-1.5 !rounded-md !bg-transparent !px-4 !text-sm !font-medium !text-amber-600 dark:!text-amber-300 transition hover:!bg-surface-secondary/55 hover:!text-amber-700 dark:hover:!text-amber-200 lg:!h-12';
    const navDropdownActiveClass =
        '!bg-[color:color-mix(in_oklab,var(--brand)_18%,var(--surface))] !text-[color:color-mix(in_oklab,var(--brand)_82%,black)] dark:!bg-accent/24 dark:!text-amber-100 !ring-1 !ring-[color:color-mix(in_oklab,var(--brand)_42%,transparent)]';

    const isPathActive = (path) => {
        if (!path) {
            return false;
        }

        if (location.pathname === path) {
            return true;
        }

        return location.pathname.startsWith(`${path}/`);
    };

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
     * @param {{ mobile?: boolean }} [options]
     * @returns {JSX.Element[]} The list of rendered menu items
     */
    const renderMenuItems = (menuItems, options = {}) => {
        const { mobile = false } = options;
        const linkClass = mobile
            ? 'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-amber-700 dark:text-amber-300 transition hover:bg-surface-secondary/55 hover:text-amber-800 dark:hover:text-amber-200'
            : navLinkClass;
        const dropdownTriggerClass = mobile
            ? '!inline-flex !h-9 !w-full !items-center !justify-start !gap-1.5 !rounded-md !bg-transparent !px-3 !text-sm !font-medium !text-foreground transition hover:!bg-surface-secondary/55 hover:!text-foreground'
            : navDropdownTriggerClass;

        return filterMenuItems(menuItems, props.user).map((menuItem) => {
            const children =
                menuItem.childItems && filterMenuItems(menuItem.childItems, props.user);
            const selfActive = isPathActive(menuItem.path);
            const childActive = !!children?.some((childItem) => isPathActive(childItem.path));
            const isActive = selfActive || childActive;

            if (children && children.length > 0) {
                const dropdownKey = `${mobile ? 'mobile' : 'desktop'}-${menuItem.title}`;
                const isOpen = openDropdownKey === dropdownKey;
                return (
                    <Dropdown
                        key={menuItem.title}
                        onOpenChange={(open) => setOpenDropdownKey(open ? dropdownKey : '')}
                    >
                        <Dropdown.Trigger>
                            <span
                                className={`${dropdownTriggerClass}${
                                    isActive ? ` ${navDropdownActiveClass}` : ''
                                }`}
                            >
                                <span>{t(menuItem.title)}</span>
                                <Icon
                                    icon={isOpen ? faChevronUp : faChevronDown}
                                    className='text-xs text-current/90'
                                />
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className='min-w-[12rem] rounded-xl border border-border/70 bg-overlay/95 p-1 text-foreground'>
                            <Dropdown.Menu
                                aria-label={t(menuItem.title)}
                                onAction={(key) => navigate(String(key))}
                            >
                                {children.map((childItem) =>
                                    childItem.path ? (
                                        <Dropdown.Item
                                            className={`rounded-md px-3 py-2 data-[hovered]:bg-surface-secondary/55 data-[focused]:bg-surface-secondary/55${
                                                isPathActive(childItem.path)
                                                    ? ' bg-[color:color-mix(in_oklab,var(--brand)_18%,var(--surface))] text-[color:color-mix(in_oklab,var(--brand)_82%,black)] dark:bg-accent/24 dark:text-amber-100'
                                                    : ''
                                            }`}
                                            key={childItem.title || childItem.path}
                                            id={childItem.path}
                                            textValue={t(childItem.title)}
                                        >
                                            <Label>{t(childItem.title)}</Label>
                                        </Dropdown.Item>
                                    ) : null
                                )}
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                );
            }

            if (!menuItem.path) {
                return null;
            }

            return (
                <Link
                    key={menuItem.title}
                    className={`${linkClass}${isActive ? ` ${navLinkActiveClass}` : ''}`}
                    href={menuItem.path}
                >
                    {t(menuItem.title)}
                </Link>
            );
        });
    };

    const navClassName = `fixed top-0 z-50 h-12 w-full text-foreground backdrop-blur-sm ${
        isLightTheme
            ? 'bg-[var(--nav-light-bg)]'
            : 'border-b border-border/80 bg-overlay/95 shadow-[0_1px_0_color-mix(in_oklab,var(--border)_88%,transparent)]'
    }`;

    return (
        <nav className={navClassName}>
            <div className='mx-auto flex h-full w-full items-center px-2 sm:px-3 lg:px-4'>
                <div className='flex w-full items-center justify-between lg:hidden'>
                    <div className='w-10' />
                    <Link href='/' className='inline-flex h-full items-center'>
                        <img src={SmallHeaderIcon} height='32' alt='TCO Logo' />
                    </Link>
                    <HeroButton
                        className='!h-8 !min-w-10 !px-2'
                        size='sm'
                        variant='tertiary'
                        onPress={() => setMobileMenuOpen((open) => !open)}
                    >
                        {mobileMenuOpen ? t('Close') : t('Menu')}
                    </HeroButton>
                </div>

                <div className='hidden h-full w-full items-center gap-2 lg:flex'>
                    <div className='flex h-full min-w-0 flex-1 items-center gap-1'>
                        {renderMenuItems(LeftMenu)}
                    </div>
                    <Link href='/' className='inline-flex h-full items-center px-2'>
                        <img
                            src={
                                currentGame?.started
                                    ? SmallHeaderIcon
                                    : isLightTheme
                                    ? HeaderIconLight
                                    : HeaderIcon
                            }
                            className='h-8 w-80 object-contain'
                            alt='TCO Logo'
                        />
                    </Link>
                    <div className='flex h-full min-w-0 flex-1 items-center justify-end gap-1 whitespace-nowrap'>
                        <GameContextMenu />
                        {!currentGame?.started && (
                            <div className={navTextClass}>
                                <span>{`${t(`${games.length} Games`)}`}</span>
                            </div>
                        )}
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
            </div>
            {mobileMenuOpen && (
                <div className='border-t border-border/70 bg-overlay/95 px-3 pb-3 pt-2 lg:hidden'>
                    <div className='grid gap-2'>
                        <div className='rounded-md border border-border/70 bg-surface/80 p-2'>
                            <div className='mb-1 text-xs uppercase tracking-wide text-muted'>
                                {t('Navigation')}
                            </div>
                            <div className='grid gap-1'>
                                {renderMenuItems(LeftMenu, { mobile: true })}
                            </div>
                        </div>
                        <div className='rounded-md border border-border/70 bg-surface/80 p-2'>
                            <div className='mb-1 text-xs uppercase tracking-wide text-muted'>
                                {t('Account')}
                            </div>
                            <div className='grid gap-1'>
                                <GameContextMenu mobile />
                                {!currentGame?.started && (
                                    <div className='inline-flex h-9 items-center px-3 text-sm text-foreground'>
                                        <span>{`${t(`${games.length} Games`)}`}</span>
                                    </div>
                                )}
                                {currentGame?.started ? (
                                    <ServerStatus
                                        connected={gameConnected}
                                        connecting={gameConnecting}
                                        serverType='Game server'
                                        responseTime={gameResponse}
                                        mobile
                                    />
                                ) : (
                                    <ServerStatus
                                        connected={lobbySocketConnected}
                                        connecting={lobbySocketConnecting}
                                        serverType='Lobby'
                                        responseTime={lobbyResponse}
                                        mobile
                                    />
                                )}
                                {renderMenuItems(RightMenu, { mobile: true })}
                                <ProfileDropdown menu={ProfileMenu} user={props.user} mobile />
                                <LanguageSelector mobile />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
