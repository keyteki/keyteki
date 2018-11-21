import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../Avatar.jsx';
import Clock from './Clock.jsx';

export class PlayerStatsRow extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        const imageStyle = { backgroundImage: `url(/img/${name.toLowerCase()}.png)` };

        return (
            <div className='state'>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                        <img src='/img/Minus.png' title='-' alt='-' />
                    </button>
                }
                <div className='stat-image' style={ imageStyle }>
                    <div className='stat-value'>{ this.getStatValueOrDefault(stat) }</div>
                </div>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                        <img src='/img/Plus.png' title='+' alt='+' />
                    </button>
                }
            </div>
        );
    }

    getHouses() {
        return (
            <div className='state'>
                {
                    this.props.houses.map(house => (
                        <img className='house-image' src={ '/img/house/' + house + '.png' } title={ house } />
                    ))
                }
            </div>
        );
    }

    render() {
        let playerAvatar = (
            <div className='player-avatar state'>
                <Avatar emailHash={ this.props.user ? this.props.user.emailHash : 'unknown' } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        let clock = (!this.props.clockState || this.props.clockState.mode === 'off') ? null : (
            <div className='state'>
                <Clock secondsLeft={ this.props.clockState.timeLeft } mode={ this.props.clockState.mode } stateId={ this.props.clockState.stateId } />
            </div>
        );

        return (
            <div className='panel player-stats no-highlight'>
                { playerAvatar }
                { this.getButton('amber', 'Amber') }
                { this.getButton('chains', 'Chains') }
                { this.props.houses ? this.getHouses() : null }
                { this.props.deckName &&
                    <div className='state'>
                        <div className='hand-size'> { this.props.deckName } </div>
                    </div>
                }
                {
                    this.props.firstPlayer &&
                    <div className='state first-player-state'>
                        <img className='first-player-indicator' src='/img/first-player.png' title='Active Player' />
                    </div>
                }
                {
                    (this.props.otherPlayer || this.props.spectating) &&
                    <div className='state'>
                        <div className='hand-size'>Hand Size: { this.props.handSize }</div>
                    </div>
                }
                {
                    this.props.activeHouse &&
                    <div className='state'>
                        <div className='hand-size'>Active House: </div>
                        <img className='house-image' src={ '/img/house/' + this.props.activeHouse + '.png' } title={ this.props.activeHouse } />
                    </div>
                }
                { clock }
            </div>
        );
    }
}

PlayerStatsRow.displayName = 'PlayerStatsRow';
PlayerStatsRow.propTypes = {
    activeHouse: PropTypes.string,
    clockState: PropTypes.object,
    firstPlayer: PropTypes.bool,
    handSize: PropTypes.number,
    houses: PropTypes.array,
    otherPlayer: PropTypes.bool,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    spectating: PropTypes.bool,
    stats: PropTypes.object,
    user: PropTypes.object
};

export default PlayerStatsRow;
