import React from 'react';
import PropTypes from 'prop-types';
import CircleType from 'circletype';

import AltCard from './AltCard';
import CardImage from './CardImage';

class CardZoom extends React.Component {
    componentDidMount() {
        if(this.idText) {
            new CircleType(this.idText).radius(140);
        }
    }

    componentDidUpdate() {
        if(this.idText) {
            new CircleType(this.idText).radius(140);
        }
    }

    render() {
        if(!this.props.card) {
            return null;
        }

        return (
            <div className='card-large vertical'>
                { this.props.show &&
                <div className='card-zoomed shadow'>
                    { this.props.card.imageUrl ?
                        <div className='card-zoomed shadow'>
                            <img className='image-large img-responsive' src={ this.props.card.imageUrl }/>
                        </div>
                        :
                        <div className='card-zoomed shadow'>
                            <span className='card-name'>{ this.props.cardName }</span>
                            <CardImage className='image-large img-responsive' img={ this.props.imageUrl } maverick={ this.props.card.maverick } anomaly={ this.props.card.anomaly } amber={ this.props.card.cardPrintedAmber }/>
                            { this.props.card && <AltCard card={ this.props.card }/> }
                        </div>
                    }
                </div>
                }
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
