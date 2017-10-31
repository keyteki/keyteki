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
                <span><img src={ '/img/' + name + '.png' } title={ name } alt={ name } className='statpng' /></span>
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

                { this.getButton('fate', 'Fate') }
                { this.getButton('honor', 'Honor') }

                { this.props.firstPlayer ? <div className='state'><img className='first-player-indicator' src='/img/first-player.png' title='First Player' /></div> : null }
                { this.props.otherPlayer || this.props.spectating ? <div className='state'><div className='hand-size'>Hand Size: { this.props.handSize }</div></div> : null }
                <div className='state'><div className ='hand-size'>Conflicts Remaining: { this.getStatValueOrDefault('conflictsRemaining') }  { this.getStatValueOrDefault('politicalRemaining') ? <span className='icon-political'/> : null }{ this.getStatValueOrDefault('militaryRemaining') ? <span className='icon-military'/> : null } </div></div>

                { this.props.showControls ? <div className='state'>
                    <button className='btn btn-transparent' onClick={ this.onSettingsClick.bind(this) }><span className='glyphicon glyphicon-cog' />Settings</button>
                </div> : null }
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    fate: PropTypes.number,
    firstPlayer: PropTypes.bool,
    handSize: PropTypes.number,
    honor: PropTypes.number,
    onSettingsClick: PropTypes.func,
    otherPlayer: PropTypes.bool,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    spectating: PropTypes.bool,
    stats: PropTypes.object,
    user: PropTypes.object
};

export default PlayerStats;
