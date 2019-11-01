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

    getNormalCardZoom() {
        return (<div className='card-large vertical'>
            { this.props.show ?
                <div className='card-zoomed shadow'>
                    { this.props.card.identity }
                    <span className='card-name'>{ this.props.cardName }</span>
                    <CardImage className='image-large img-responsive' img={ this.props.imageUrl } maverick={ this.props.card.maverick } anomaly={ this.props.card.anomaly } amber={ this.props.card.cardPrintedAmber }/>
                    { this.props.card && <AltCard card={ this.props.card }/> }
                </div>
                : null }
        </div>);
    }

    render() {
        if(!this.props.card) {
            return null;
        }

        if(this.props.card.imageType) {
            return (
                <div className='card-large vertical'>
                    { this.props.show &&
                    <div className='card-zoomed shadow'>
                        { this.props.card.imageType === 'archon' ? this.props.card :
                            <img className='image-large img-responsive' src={ this.props.card.imageUrl }/>
                        }
                    </div>
                    }
                </div>);
        }

        return this.getNormalCardZoom();
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
