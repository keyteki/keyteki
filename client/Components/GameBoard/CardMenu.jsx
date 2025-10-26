// @ts-nocheck
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './CardMenu.scss';

const CardMenu = ({ menu, onMenuItemClick }) => {
    const { t } = useTranslation();
    const [submenu, setSubmenu] = useState('main');

    const handleMenuItemClick = useCallback(
        (menuItem) => {
            if (['main', 'tokens'].includes(menuItem.command)) {
                setSubmenu(menuItem.command);
            } else {
                if (onMenuItemClick) {
                    onMenuItemClick(menuItem);
                }
            }
        },
        [onMenuItemClick]
    );

    const menuItems = useMemo(() => {
        let menuIndex = 0;
        return menu.map((menuItem) => {
            let className = classNames('menu-item', {
                disabled: !!menuItem.disabled
            });
            if (menuItem.menu === submenu) {
                return (
                    <div
                        key={menuIndex++}
                        className={className}
                        onClick={() => handleMenuItemClick(menuItem)}
                    >
                        {t(menuItem.text)}
                    </div>
                );
            }
            return null;
        });
    }, [menu, submenu, handleMenuItemClick, t]);

    return <div className='panel menu'>{menuItems}</div>;
};

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func
};

export default CardMenu;
