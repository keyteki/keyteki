import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from 'react-bootstrap';

import Panel from '../Site/Panel';
import DeckStatus from '../Decks/DeckStatus';
import Avatar from '../Site/Avatar';

import './PendingGamePlayer.scss';

/**
 * @typedef PendingGamePlayersProps
 * @property {PendingGame} currentGame The current pending game
 * @property {User} user The logged in user
 * @property {function(): void} onSelectDeck The callback to be invoked when a deck selection is requested
 */

/**
 * @param {PendingGamePlayersProps} props
 */
const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    const { t } = useTranslation();

    let firstPlayer = true;
    return (
        <Panel title={t('Players')}>
            {Object.values(currentGame.players).map((player) => {
                const playerIsMe = player && player.name === user?.username;
                const isSealed = currentGame.gameFormat === 'sealed';

                let deck = null;
                let selectLink = null;
                let status = null;

                if (player && player.deck && player.deck.selected && isSealed) {
                    deck = <span className='deck-selection'>Sealed Deck Selected</span>;
                } else if (player && player.deck && player.deck.selected) {
                    if (playerIsMe) {
                        deck = (
                            <span className='deck-selection clickable' onClick={onSelectDeck}>
                                {player.deck.name}
                            </span>
                        );
                    } else {
                        deck = (
                            <span className='deck-selection'>
                                <Trans>Deck Selected</Trans>
                            </span>
                        );
                    }

                    status = <DeckStatus status={player.deck.status} />;
                } else if (player && playerIsMe && !isSealed) {
                    selectLink = (
                        <Button onClick={onSelectDeck}>
                            <Trans>Select Deck</Trans>
                        </Button>
                    );
                } else if (isSealed) {
                    selectLink = (
                        <span>
                            <Trans>Sealed deck loading...</Trans>
                        </span>
                    );
                }

                let userClass =
                    'username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');
                let rowClass = 'player-row';
                if (firstPlayer) {
                    rowClass += ' mb-2';

                    firstPlayer = false;
                }
                return (
                    <div className={rowClass} key={player.name}>
                        <Avatar imgPath={player.avatar} />
                        <span className={userClass}>{player.name}</span>
                        {deck} {status} {selectLink}
                    </div>
                );
            })}
        </Panel>
    );
};

export default PendingGamePlayers;
