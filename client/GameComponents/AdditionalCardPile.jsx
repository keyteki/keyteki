import React from 'react';
import _ from 'underscore';

import CardPile from './CardPile.jsx';

class AdditionalCardPile extends React.Component {
    render() {
        var topCard = _.last(this.props.pile.cards);
        if(this.props.pile.isPrivate) {
            topCard = { facedown: true, bowed: true };
        } else if(topCard.facedown) {
            topCard.bowed = true;
        }

        return (
            <CardPile
                className={ this.props.className }
                title={ this.props.pile.title }
                source='additional'
                cards={ this.props.pile.cards }
                topCard={ topCard }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' }
                disablePopup={ this.props.pile.isPrivate && !(this.props.isMe || this.props.spectating) }
                orientation='horizontal' />
        );
    }
}

AdditionalCardPile.displayName = 'AdditionalCardPile';
AdditionalCardPile.propTypes = {
    className: React.PropTypes.string,
    isMe: React.PropTypes.bool,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    pile: React.PropTypes.object,
    spectating: React.PropTypes.bool
};

export default AdditionalCardPile;
