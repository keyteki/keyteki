import React from 'react';
import PropTypes from 'prop-types';

import Province from './Province.jsx';
import Placeholder from './Placeholder.jsx';
import CardPile from './CardPile.jsx';

class StrongholdRow extends React.Component {

    getFavor(player) {
        return (<div className='card-wrapper imperial-favor'>
            { player ? <img className={ 'imperial-favor ' + (player.imperialFavor ? '' : 'hidden') }
                src={ '/img/' + (player.imperialFavor ? player.imperialFavor : 'political') + '-favor.png' } /> : '' }
        </div>);
    }

    render() {

        if(this.props.isMe) {

            return (
                <div className='stronghold-row'>
                    <div className='deck-cards'>
                        { this.props.role && this.props.role.location ? <CardPile className='rolecard' source='role card' cards={ [] } topCard={ this.props.role } disablePopup
                            onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } /> : <Placeholder size={ this.props.cardSize } /> }
                        <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } />
                        { this.getFavor(this.props.thisPlayer) }
                    </div>
                </div>
            );
        }
        return (
            <div className='stronghold-row'>
                <div className='deck-cards'>
                    <Placeholder size={ this.props.cardSize } />
                    <Placeholder size={ this.props.cardSize } />
                    <Placeholder size={ this.props.cardSize } />
                    <Placeholder size={ this.props.cardSize } />
                    <Placeholder size={ this.props.cardSize } />
                    { !this.props.isMe && this.props.thisPlayer) ? this.getFavor(this.props.thisPlayer) : this.getFavor(this.props.otherPlayer) }
                    <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } />
                    { this.props.role && this.props.role.location ? <CardPile className='rolecard' source='role card' cards={ [] } topCard={ this.props.role } disablePopup
                        onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } /> : '' }
                </div>
            </div>
        );

    }
}

StrongholdRow.displayName = 'StrongholdRow';
StrongholdRow.propTypes = {
    cardSize: PropTypes.string,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    role: PropTypes.object,
    spectating: PropTypes.bool,
    strongholdProvinceCards: PropTypes.array,
    thisPlayer: PropTypes.object
};

export default StrongholdRow;
