import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

import { withTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { thisExpression } from '@babel/types';

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

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
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

    getHealth() {
        return (
            <div className='state'>
                <div>Health: { this.props.stats['health'] }</div>
            </div>
        );
    }

    getMana() {
        return (
            <div className='state'>
                <div>Mana: { this.props.stats['mana'] }</div>
            </div>
        );
    }

    render() {
        let t = this.props.t;
        let playerAvatar = (
            <div className='player-avatar'>
                <Avatar username={ this.props.user ? this.props.user.username : undefined } />
                <b>{ this.props.user ? this.props.user.username : t('Noone') }</b>
            </div>);
        let muteClass = this.props.muteSpectators ? 'glyphicon-eye-close' : 'glyphicon-eye-open';

        return (
            <div className='panel player-stats'>
                { playerAvatar }

                { this.getHealth() }

                { this.props.activePlayer &&
                    <div className='state first-player-state'>
                        <Trans>Active Player</Trans>
                    </div>
                }

                { this.getMana() }

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
    activePlayer: PropTypes.bool,
    i18n: PropTypes.object,
    manualModeEnabled: PropTypes.bool,
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
