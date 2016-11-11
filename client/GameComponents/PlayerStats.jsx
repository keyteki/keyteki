import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class InnerPlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.socket.emit('changestat', type, direction === 'up' ? 1 : -1);
    }

    render() {
        return (
            <div>
                <div className='panel state'>
                    <div>
                        <span>{this.props.gold + ' Gold'}</span>
                        {this.props.isMe ?
                            <div className='pull-right'>
                                <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'gold', 'down')}>-</button>
                                <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'gold', 'up')}>+</button>
                            </div> :
                            null}
                    </div>
                    <div>
                        <span>{this.props.power + ' Power'}</span>
                        {this.props.isMe ?
                            <div className='pull-right'>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'power', 'down')}>-</span>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'power', 'up')}>+</span>
                            </div> :
                            null}
                    </div>
                    <div>
                        <span>{this.props.reserve + ' Reserve'}</span>
                        {this.props.isMe ?
                            <div className='pull-right'>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'reserve', 'down')}>-</span>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'reserve', 'up')}>+</span>
                            </div> :
                            null}
                    </div>
                    <div>
                        <span>{this.props.claim + ' Claim'}</span>
                        {this.props.isMe ?
                            <div className='pull-right'>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'down')}>-</span>
                                <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'up')}>+</span>
                            </div> :
                            null}
                    </div>
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
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const PlayerStats = connect(mapStateToProps, actions)(InnerPlayerStats);

export default PlayerStats;
