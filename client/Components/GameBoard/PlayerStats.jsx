import React from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faCopy,
    faWrench,
    faCogs,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';

import Avatar from '../Site/Avatar';
import { Constants } from '../../constants';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';

import './PlayerStats.scss';

export class PlayerStats extends React.Component {
    constructor(props) {
        super(props);

        this.sendUpdate = this.sendUpdate.bind(this);
        this.setActiveHouse = this.setActiveHouse.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    setActiveHouse(house) {
        if (this.props.showControls) {
            this.props.sendGameMessage('changeActiveHouse', house);
        }
    }

    getStatValueOrDefault(stat) {
        if (!this.props.stats) {
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
            <div className='state' title={name}>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, statToSet, 'down')}
                    >
                        <img src={Minus} title='-' alt='-' />
                    </a>
                ) : null}
                <div className={`stat-image ${stat}`}>
                    <div className='stat-value'>{this.getStatValueOrDefault(stat)}</div>
                </div>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, statToSet, 'up')}
                    >
                        <img src={Plus} title='+' alt='+' />
                    </a>
                ) : null}
            </div>
        );
    }

    getKeyCost() {
        return (
            <div className='state' title={this.props.t('Current Key Cost')}>
                <div className='stat-image keyCost'>
                    <div className='stat-value'>{this.getStatValueOrDefault('keyCost')}</div>
                </div>
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if (this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    getHouses() {
        return (
            <div className='state'>
                {this.props.houses.map((house) => (
                    <img
                        key={house}
                        onClick={this.setActiveHouse.bind(this, house)}
                        className='img-fluid'
                        src={Constants.HouseIconPaths[house]}
                        title={this.getHouse(house)}
                    />
                ))}
            </div>
        );
    }

    writeChatToClipboard(event) {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    }

    render() {
        let t = this.props.t;
        let playerAvatar = (
            <div className='pr-1'>
                <Avatar imgPath={this.props.user?.avatar} />
                <b>{this.props.user?.username || t('Noone')}</b>
            </div>
        );
        let matchRecord = this.props.matchRecord && (
            <div
                className='state'
                title={`Matches: ${this.props.matchRecord.thisPlayer.name} ${this.props.matchRecord.thisPlayer.wins} - ${this.props.matchRecord.otherPlayer.name} ${this.props.matchRecord.otherPlayer.wins}`}
            >
                <span>{`${this.props.matchRecord.thisPlayer.wins} - ${this.props.matchRecord.otherPlayer.wins}`}</span>
            </div>
        );
        let statsClass = classNames('panel player-stats', {
            'active-player': this.props.activePlayer
        });

        return (
            <div className={statsClass}>
                {playerAvatar}

                {this.getButton('amber', t('Amber'))}
                {this.getButton('chains', t('Chains'))}
                {this.getKeyCost()}

                {this.props.houses ? this.getHouses() : null}

                {matchRecord}

                {this.props.activeHouse && (
                    <div className='state'>
                        <div className='hand-size'>
                            <Trans>Active House</Trans>:{' '}
                        </div>
                        <img
                            className='house-image'
                            src={Constants.HouseIconPaths[this.props.activeHouse]}
                            title={this.getHouse(this.props.activeHouse)}
                        />
                    </div>
                )}

                {this.props.activePlayer && (
                    <div className='state first-player-state'>
                        <Trans>Active Player</Trans>
                    </div>
                )}

                {this.props.showMessages && (
                    <div className='state chat-status'>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1'>
                                <FontAwesomeIcon
                                    icon={this.props.muteSpectators ? faEyeSlash : faEye}
                                    onClick={this.props.onMuteClick}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1'>
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    onClick={this.writeChatToClipboard.bind(this)}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        {this.props.showManualMode && (
                            <div className='state'>
                                <a
                                    href='#'
                                    className={this.props.manualModeEnabled ? 'text-danger' : ''}
                                    onClick={this.props.onManualModeClick}
                                >
                                    <FontAwesomeIcon icon={faWrench}></FontAwesomeIcon>
                                    <span className='ml-1'>
                                        <Trans>Manual Mode</Trans>
                                    </span>
                                </a>
                            </div>
                        )}
                        <div className='state'>
                            <a
                                href='#'
                                onClick={this.onSettingsClick.bind(this)}
                                className='pr-1 pl-1'
                            >
                                <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
                                <span className='ml-1'>
                                    <Trans>Settings</Trans>
                                </span>
                            </a>
                        </div>
                        <div>
                            <a href='#' onClick={this.props.onMessagesClick} className='pl-1'>
                                <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                {this.props.numMessages > 0 && (
                                    <Badge variant='danger'>{this.props.numMessages}</Badge>
                                )}
                            </a>
                        </div>
                    </div>
                )}
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
