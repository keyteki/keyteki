import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Avatar.jsx';

export class PlayerStats extends React.Component {
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
        return (
            <div className='state'>
                <span><img src={ '/img/' + name + '.png' } title={ name } alt={ name } /></span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }

                <span>{ this.getStatValueOrDefault(stat) }</span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    render() {
        var playerAvatar = (
            <div className='player-avatar'>
                <Avatar emailHash={ this.props.user ? this.props.user.emailHash : 'unknown' } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        return (
            <div className='panel player-stats'>
                { playerAvatar }


            </div>
        );
    }
}

InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    fate: React.PropTypes.number,
    honor: React.PropTypes.number,
    isMe: React.PropTypes.bool,
    playerName: React.PropTypes.string,
    sendGameMessage: React.PropTypes.func,
    user: React.PropTypes.object
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    stats: PropTypes.object,
    user: PropTypes.object
};

export default PlayerStats;
