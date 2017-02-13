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
        this.props.sendSocketMessage('changeStat', type, direction === 'up' ? 1 : -1);
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
                    <span>{this.props.gold + ' Gold'}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'gold', 'down')}>-</button>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'gold', 'up')}>+</button>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span>{this.props.power + ' Power'}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'power', 'down')}>-</span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'power', 'up')}>+</span>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span>{this.props.reserve + ' Reserve'}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'reserve', 'down')}>-</span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'reserve', 'up')}>+</span>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span>{this.props.claim + ' Claim'}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'down')}>-</span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'up')}>+</span>
                        </div> :
                        null}
                </div>
            </div>
        );
    }
}

InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    claim: React.PropTypes.number,
    gold: React.PropTypes.number,
    isMe: React.PropTypes.bool,
    playerName: React.PropTypes.string,
    power: React.PropTypes.number,
    reserve: React.PropTypes.number,
    sendSocketMessage: React.PropTypes.func,
    user: React.PropTypes.object
};

function mapStateToProps() {
    return {};
}

const PlayerStats = connect(mapStateToProps, actions)(InnerPlayerStats);

export default PlayerStats;
