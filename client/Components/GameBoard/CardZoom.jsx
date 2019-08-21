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
                    <CardImage className='image-large img-responsive'
                        img={ this.props.imageUrl }
                        maverick={ this.props.card.maverick }
                        amber={ this.props.card.cardPrintedAmber }/>
                    { this.props.card && <AltCard card={ this.props.card } /> }
                </div>
                : null }
        </div>);
    }

    getIdentityCardZoom() {
        let index = 1;
        let houses = this.props.card.houses && this.props.card.houses.map(house => {
            return <div key={ `id-house-${index++}` } className={ `house id-house-${index++}` }><img key={ house } className='img-responsive' src={ `/img/house/${house}.png` } /></div >;
        });

        return (<div className='card-large vertical'>
            <div className='card-zoomed shadow'>
                <div>
                    <img className={ 'image-large img-responsive' } src='/img/idbacks/identity.jpg' title={ this.props.card.identity } />
                </div>
                <div className='id-zoom-container'>
                    <div className={ 'identity-text' } ref={ idText => this.idText = idText }>{ this.props.card.identity }</div>
                    <div className='identity-icons'>
                        { houses }
                    </div>
                </div>
            </div>
        </div >);
    }

    render() {
        if(!this.props.card) {
            return null;
        }

        if(this.props.card.identity) {
            return this.getIdentityCardZoom();
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
