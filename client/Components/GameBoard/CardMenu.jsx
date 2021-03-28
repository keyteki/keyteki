import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

import './CardMenu.scss';

class CardMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submenu: 'main'
        };
    }

    onMenuItemClick(menuItem) {
        if (['main', 'tokens'].includes(menuItem.command)) {
            this.setState({ submenu: menuItem.command });
        } else {
            if (this.props.onMenuItemClick) {
                this.props.onMenuItemClick(menuItem);
            }
        }
    }

    render() {
        let menuIndex = 0;
        let menuItems = this.props.menu.map((menuItem) => {
            let className = classNames('menu-item', {
                disabled: !!menuItem.disabled
            });
            if (menuItem.menu === this.state.submenu) {
                return (
                    <div
                        key={menuIndex++}
                        className={className}
                        onClick={this.onMenuItemClick.bind(this, menuItem)}
                    >
                        {this.props.t(menuItem.text)}
                    </div>
                );
            }
        });

        return <div className='panel menu'>{menuItems}</div>;
    }
}

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    i18n: PropTypes.object,
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(CardMenu);
