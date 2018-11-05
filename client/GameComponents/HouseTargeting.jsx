import React from 'react';
import PropTypes from 'prop-types';

class HouseTargeting extends React.Component {
    onClick(event, house) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(this.props.command, house, this.props.uuid);
        }
    }

    renderHouse(house) {
        return (
            <div className='house'>
                <img className='house-image'
                    alt={ house }
                    onClick={ event => this.onClick(event, house) }
                    src={ '/img/house/' + house + '.png' } />
            </div>);
    }

    render() {
        return (
            <div className='prompt-control-targeting'>
                { this.props.houses.map(house => this.renderHouse(house)) }
            </div>
        );
    }
}

HouseTargeting.displayName = 'HouseTargeting';
HouseTargeting.propTypes = {
    command: PropTypes.string,
    houses: PropTypes.array,
    onButtonClick: PropTypes.func,
    uuid: PropTypes.string
};

export default HouseTargeting;
