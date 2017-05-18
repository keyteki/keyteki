import React from 'react';
import { connect } from 'react-redux';

import Avatar from '../Avatar.jsx';

import * as actions from '../actions';

export class InnerPlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    render() {
        var playerAvatar = this.props.user ? (
                    <div className='player-avatar' key={this.props.user.id}>
                        <Avatar emailHash={this.props.user.emailHash} /><b>{this.props.user.username}</b>
                    </div>) : null;

        return (
            <div className='panel player-stats'>
                {playerAvatar}
                <div className='state'>
                    <span><img src='/img/Fate.png' title='Fate' alt='Fate' /> {this.props.fate}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'fate', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></button>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'fate', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></button>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span><img src='/img/Honor.png' title='Honor' alt='Honor' /> {this.props.power}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'honor', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'power', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></span>
                        </div> :
                        null}
                </div>
            </div>
        );
    }
}

InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    fate: React.PropTypes.number,
    isMe: React.PropTypes.bool,
    playerName: React.PropTypes.string,
    honor: React.PropTypes.number,
    sendGameMessage: React.PropTypes.func,
    user: React.PropTypes.object
};

function mapStateToProps() {
    return {};
}

const PlayerStats = connect(mapStateToProps, actions)(InnerPlayerStats);

export default PlayerStats;
