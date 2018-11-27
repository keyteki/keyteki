import React from 'react';
import PropTypes from 'prop-types';

import AltCard from './AltCard';

class CardZoom extends React.Component {
    render() {
        return (
            <div className='card-large vertical'>
                { this.props.show ?
                    <div className='card-zoomed shadow'>
                        <span className='card-name'>{ this.props.cardName }</span>
                        <img className='image-large img-responsive' src={ this.props.imageUrl } />
                        { this.props.card && <AltCard card={ this.props.card } /> }
                    </div>
                    : null }
            </div>);
    }
}

CardZoom.displayName = 'CardZoom';
CardZoom.propTypes = {
    card: PropTypes.object,
    cardName: PropTypes.string,
    imageUrl: PropTypes.string,
    show: PropTypes.bool
};

export default CardZoom;
