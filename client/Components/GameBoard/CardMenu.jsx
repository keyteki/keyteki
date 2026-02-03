import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './CardMenu.scss';

const CardMenu = (props) => {
    const { t } = useTranslation();
    const [submenu, setSubmenu] = useState('main');

    const onMenuItemClick = (menuItem) => {
        if (['main', 'tokens'].includes(menuItem.command)) {
            setSubmenu(menuItem.command);
        } else if (props.onMenuItemClick) {
            props.onMenuItemClick(menuItem);
        }
    };

    let menuIndex = 0;
    const menuItems = props.menu
        .map((menuItem) => {
            const className = classNames('menu-item', {
                disabled: !!menuItem.disabled
            });
            if (menuItem.menu === submenu) {
                return (
                    <div
                        key={menuIndex++}
                        className={className}
                        onClick={() => onMenuItemClick(menuItem)}
                    >
                        {t(menuItem.text)}
                    </div>
                );
            }
        })
        .filter(Boolean);

    return <div className='panel menu'>{menuItems}</div>;
};

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func
};

export default CardMenu;
