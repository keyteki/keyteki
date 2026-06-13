import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const CardMenu = (props) => {
    const { t } = useTranslation();
    const [submenu, setSubmenu] = useState('main');
    const ref = useRef(null);

    const onMenuItemClick = (menuItem) => {
        if (['main', 'tokens', 'under'].includes(menuItem.command)) {
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

    // After layout, if the menu would extend below the viewport, shift it
    // upward by exactly the overflow amount (plus a small margin) so it
    // bottoms out at the viewport edge instead of being clipped.
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) {
            return;
        }
        node.style.transform = '';
        const rect = node.getBoundingClientRect();
        const overflow = rect.bottom - window.innerHeight;
        if (overflow > 0) {
            node.style.transform = `translateY(${-overflow - 8}px)`;
        }
    }, [menuItems.length, submenu]);

    return (
        <div ref={ref} className='panel menu' onMouseDown={(e) => e.stopPropagation()}>
            {menuItems}
        </div>
    );
};

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func
};

export default CardMenu;
