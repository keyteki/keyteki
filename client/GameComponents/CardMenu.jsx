import React from 'react';
import _ from 'underscore';

class CardMenu extends React.Component {
    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(menuItem);
        }
    }

    render() {
        var menuIndex = 0;
        var menuItems = _.map(this.props.menu, menuItem => {
            return <div key={ menuIndex++ } onClick={ this.onMenuItemClick.bind(this, menuItem) }>{ menuItem.text }</div>;
        });

        return (
            <div className='panel menu'>
                { menuItems }
            </div>
        );
    }
}

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: React.PropTypes.array.isRequired,
    onMenuItemClick: React.PropTypes.func
};

export default CardMenu;
