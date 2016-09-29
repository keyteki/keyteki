import React from 'react';

class PlayerStats extends React.Component {
    render() {
        return (
            <div>
                <div className='panel state'>
                    <div>
                        <span>{ this.props.gold } Gold</span>
                    </div>
                    <div>
                        <span>{ this.props.power } Power</span>
                    </div>
                    <div>
                        <span>{ this.props.reserve } Reserve</span>
                    </div>
                    <div>
                        <span>{ this.props.claim } Claim</span>
                    </div>
                </div>
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    claim: React.PropTypes.string,
    gold: React.PropTypes.string,
    playerName: React.PropTypes.string,
    power: React.PropTypes.string,
    reserve: React.PropTypes.string
};

export default PlayerStats;
