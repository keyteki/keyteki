import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sendGameMessage } from '../../redux/actions';
import { toastr } from 'react-redux-toastr';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faCopy,
    faWrench,
    faCogs,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@heroui/react';

import Avatar from '../Site/Avatar';
import { Constants } from '../../constants';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';

import Keys from './Keys';
import IdentityCard from './IdentityCard';
import CardPileLink from './CardPileLink';
import Droppable from './Droppable';
import DrawDeck from './DrawDeck';
import './PlayerStats.scss';

const PlayerStats = ({
    activeHouse,
    activePlayer,
    cardPiles,
    cardBack,
    deck,
    houses,
    isMe,
    manualMode,
    muteSpectators,
    numDeckCards,
    numMessages,
    onCardClick,
    onDragDrop,
    onDrawPopupChange,
    onMenuItemClick,
    onPopupChange,
    onTouchMove,
    onClickTide,
    onManualModeClick,
    onMessagesClick,
    onMuteClick,
    onSettingsClick,
    showControls,
    onMouseOut,
    onMouseOver,
    onShuffleClick,
    showDeckName,
    showManualMode,
    showMessages,
    side,
    size,
    spectating,
    stats,
    tideRequired,
    user
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const getStatValueOrDefault = (stat) => {
        if (!stats) {
            return 0;
        }

        return stats[stat] || 0;
    };

    const getHouse = (house) => {
        let houseTitle = t(house);
        return houseTitle[0].toUpperCase() + houseTitle.slice(1);
    };

    const getButton = (stat, name, statToSet = stat) => {
        return (
            <div className='state' title={t(name)}>
                {showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={() => {
                            dispatch(sendGameMessage('changeStat', statToSet, -1));
                        }}
                    >
                        <img src={Minus} title='-' alt='-' />
                    </a>
                ) : null}
                <div className='stat-value'>{getStatValueOrDefault(stat)}</div>
                <div className={`stat-image ${stat}`} />
                {showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={() => {
                            dispatch(sendGameMessage('changeStat', statToSet, 1));
                        }}
                    >
                        <img src={Plus} title='+' alt='+' />
                    </a>
                ) : null}
            </div>
        );
    };

    const getKeyCost = () => {
        return (
            <div className='state' title={t('Current Key Cost')}>
                <div className='stat-value'>{getStatValueOrDefault('keyCost')}</div>
                <div className='stat-image keyCost' />
            </div>
        );
    };

    const getHouses = () => {
        if (deck.uuid) {
            return (
                <div className='state'>
                    {houses.map((house) => (
                        <img
                            key={house}
                            onClick={() => {
                                if (showControls) {
                                    dispatch(sendGameMessage('changeActiveHouse', house));
                                }
                            }}
                            className={`img-fluid ${
                                activeHouse === house ? 'active' : 'inactive'
                            }-house`}
                            src={Constants.IdBackHousePaths[house]}
                            title={getHouse(house)}
                        />
                    ))}
                </div>
            );
        }
    };

    const getTide = () => {
        if (tideRequired) {
            return (
                <div className='state'>
                    <img
                        key='tide'
                        onClick={onClickTide}
                        className='img-fluid tide'
                        src={Constants.TideImages[stats.tide]}
                        title={t(`${stats.tide}-tide`)}
                    />
                </div>
            );
        }
    };

    const writeChatToClipboard = (event) => {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    };

    let playerAvatar = (
        <div className={`pr-1 player-info ${activePlayer ? 'active-player' : 'inactive-player'}`}>
            <Avatar imgPath={user?.avatar} />
            <b>{user?.username || t('Noone')}</b>
        </div>
    );

    let statsClass = classNames('panel player-stats');

    const pileProps = {
        isMe,
        onMenuItemClick,
        onPopupChange,
        onTouchMove,
        cardBack,
        manualMode,
        onCardClick,
        onDragDrop,
        onMouseOut,
        onMouseOver,
        popupLocation: side,
        size
    };

    const renderDroppableList = (source, child) => {
        return isMe ? (
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                {child}
            </Droppable>
        ) : (
            child
        );
    };

    let draw = (
        <DrawDeck
            {...pileProps}
            className='draw'
            cardCount={numDeckCards}
            cards={cardPiles.deck}
            isMe={isMe}
            numDeckCards={numDeckCards}
            onPopupChange={onDrawPopupChange}
            onShuffleClick={onShuffleClick}
            showDeckName={showDeckName}
            spectating={spectating}
        />
    );

    const discard = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.discard}
            className='discard'
            title={t('Discard')}
            source='discard'
        />
    );
    const archives = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.archives}
            className='archives'
            title={t('Archives')}
            source='archives'
        />
    );
    const purged = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.purged}
            className='purged'
            title={t('Purged')}
            source='purged'
        />
    );
    const hand = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.hand}
            className='hand'
            title={t('Hand')}
            source='hand'
        />
    );

    return (
        <div className={statsClass}>
            <div className='state'>
                {playerAvatar}
                <Keys keys={stats.keys} manualMode={manualMode} />
                {getButton('amber', t('Amber'))}
                {getButton('chains', t('Chains'))}
                {getKeyCost()}

                {houses ? getHouses() : null}
                {getTide()}
                <IdentityCard
                    deck={deck}
                    showDeckName={showDeckName}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                />

                {!isMe && <div className='state'>{renderDroppableList('hand', hand)}</div>}

                <div className='state'>{renderDroppableList('draw', draw)}</div>
                <div className='state'>{renderDroppableList('discard', discard)}</div>
                {((cardPiles.archives && cardPiles.archives.length > 0) || manualMode) && (
                    <div className='state'>{renderDroppableList('archives', archives)}</div>
                )}
                {((cardPiles.purged && cardPiles.purged.length > 0) || manualMode) && (
                    <div className='state'>{renderDroppableList('purged', purged)}</div>
                )}
            </div>

            {showMessages && (
                <div className='state'>
                    <div className='state'>
                        <a href='#' className='pr-1 pl-1'>
                            <FontAwesomeIcon
                                icon={muteSpectators ? faEyeSlash : faEye}
                                onClick={onMuteClick}
                            ></FontAwesomeIcon>
                        </a>
                    </div>
                    <div className='state'>
                        <a href='#' className='pr-1 pl-1'>
                            <FontAwesomeIcon
                                icon={faCopy}
                                onClick={writeChatToClipboard}
                            ></FontAwesomeIcon>
                        </a>
                    </div>
                    {showManualMode && (
                        <div className='state'>
                            <a
                                href='#'
                                className={manualMode ? 'text-danger' : ''}
                                onClick={onManualModeClick}
                            >
                                <FontAwesomeIcon icon={faWrench}></FontAwesomeIcon>
                                {t('Manual Mode')}
                            </a>
                        </div>
                    )}
                    <div className='state'>
                        <a href='#' onClick={onSettingsClick} className='pr-1 pl-1'>
                            <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
                            <span className='ml-1'>{t('Settings')}</span>
                        </a>
                    </div>
                    <div className='state'>
                        <a href='#' onClick={onMessagesClick} className='pl-1'>
                            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                            {numMessages > 0 && (
                                <Chip color='danger' size='sm' variant='solid'>
                                    {numMessages}
                                </Chip>
                            )}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

PlayerStats.displayName = 'PlayerStats';

export default PlayerStats;
