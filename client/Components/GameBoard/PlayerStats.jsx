import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

import { withTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
        this.setActiveHouse = this.setActiveHouse.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    setActiveHouse(house) {
        if(this.props.showControls) {
            this.props.sendGameMessage('changeActiveHouse', house);
        }
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getHouse(house) {
        let houseTitle = this.props.t(house);
        return houseTitle[0].toUpperCase() + houseTitle.slice(1);
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state' title={ name }>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }
                <div className={ `stat-image ${stat}` }>
                    <div className='stat-value'>{ this.getStatValueOrDefault(stat) }</div>
                </div>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    getKeyCost() {
        return (
            <div className='state' title={ this.props.t('Current Key Cost') }>
                <div className='stat-image keyCost'>
                    <div className='stat-value'>{ this.getStatValueOrDefault('keyCost') }</div>
                </div>
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    getHouses() {
        return (
            <div className='state'>
                { this.props.houses.map(house => (<img key={ house } onClick={ this.setActiveHouse.bind(this, house) } className='img-responsive' src={ `/img/house/${house}.png` } title={ this.getHouse(house) } />)) }
            </div>
        );
    }

    writeChatToClipboard(event) {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if(messagePanel) {
            navigator.clipboard.writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    }

    render() {
        let t = this.props.t;
        let playerAvatar = (
            <div className='player-avatar'>
                <Avatar username={ this.props.user ? this.props.user.username : undefined } />
                <b>{ this.props.user ? this.props.user.username : t('Noone') }</b>
            </div>);
        let matchRecord = (
            this.props.matchRecord &&
            <div className='state' title={ `Matches: ${this.props.matchRecord.thisPlayer.name} ${this.props.matchRecord.thisPlayer.wins} - ${this.props.matchRecord.otherPlayer.name} ${this.props.matchRecord.otherPlayer.wins}` }>
                <span>{ `${this.props.matchRecord.thisPlayer.wins} - ${this.props.matchRecord.otherPlayer.wins}` }</span>
            </div>
        );
        let muteClass = this.props.muteSpectators ? 'glyphicon-eye-close' : 'glyphicon-eye-open';

        return (
            <div className='panel player-stats'>
                { playerAvatar }

                { this.getButton('amber', t('Amber')) }
                { this.getButton('chains', t('Chains')) }
                { this.getKeyCost() }

                { this.props.houses ? this.getHouses() : null }

                { matchRecord }

                { this.props.activeHouse &&
                    <div className='state'>
                        <div className='hand-size'><Trans>Active House</Trans>: </div>
                        <img className='house-image' src={ `/img/house/${this.props.activeHouse}.png` } title={ this.getHouse(this.props.activeHouse) } />
                    </div>
                }

                { this.props.activePlayer &&
                    <div className='state first-player-state'>
                        <Trans>Active Player</Trans>
                    </div>
                }

                { this.props.showMessages &&
                    <div className='state chat-status'>
                        <div className='state'>
                            <button className='btn btn-transparent btn-noimg' onClick={ this.props.onMuteClick }>
                                <span className={ `glyphicon ${muteClass}` } />
                            </button>
                        </div>
                        <div className='state'>
                            <button className='btn btn-transparent btn-noimg' onClick={ this.writeChatToClipboard.bind(this) }>
                                <span className='glyphicon glyphicon-copy' />
                            </button>
                        </div>
                        {
                            this.props.showManualMode &&
                            <div className='state'>
                                <button
                                    className={ 'btn btn-transparent btn-noimg ' + (this.props.manualModeEnabled ? 'manual' : 'auto') }
                                    onClick={ this.props.onManualModeClick } >
                                    <span className='glyphicon glyphicon-wrench' />
                                    <span><Trans>Manual Mode</Trans></span>
                                </button>
                            </div>
                        }
                        <div className='state'>
                            <button className='btn btn-transparent btn-noimg' onClick={ this.onSettingsClick.bind(this) }><span className='glyphicon glyphicon-cog' /><Trans>Settings</Trans></button>
                        </div>
                        <div>
                            <button className='btn btn-transparent btn-noimg' onClick={ this.props.onMessagesClick } >
                                <span className='glyphicon glyphicon-envelope' />
                                <span className='chat-badge badge progress-bar-danger'>{ this.props.numMessages || null }</span>
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    activeHouse: PropTypes.string,
    activePlayer: PropTypes.bool,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    manualModeEnabled: PropTypes.bool,
    matchRecord: PropTypes.object,
    muteSpectators: PropTypes.bool,
    numMessages: PropTypes.number,
    onManualModeClick: PropTypes.func,
    onMessagesClick: PropTypes.func,
    onMuteClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    showManualMode: PropTypes.bool,
    showMessages: PropTypes.bool,
    stats: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object
};

export default withTranslation()(PlayerStats);
