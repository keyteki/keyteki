import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { gameCloseRequested, gameSendMessage } from '../../redux/socketActions';

const GameContextMenu = ({ mobile = false }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);

    const isSpectating = !currentGame?.players[user?.username];

    const itemClass = mobile
        ? 'inline-flex h-9 w-full items-center rounded-md px-3 text-left text-sm font-medium text-foreground transition hover:bg-accent/15 hover:text-foreground'
        : 'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted transition hover:bg-accent/15 hover:text-foreground lg:h-12';

    const isGameActive = () => {
        if (!currentGame || !user) {
            return false;
        }

        if (currentGame.winner) {
            return false;
        }

        let thisPlayer = currentGame.players[user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(currentGame.players)[0];
        }

        const otherPlayer = Object.values(currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        if (!otherPlayer) {
            return false;
        }

        if (otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    };

    const onLeaveClick = () => {
        if (!isSpectating && isGameActive()) {
            const confirmed = window.confirm(
                t(
                    'Your game is not finished. If you leave you will concede the game. Are you sure you want to leave?'
                )
            );

            if (!confirmed) {
                return;
            }

            dispatch(gameSendMessage('concede'));
            dispatch(gameSendMessage('leavegame'));
            dispatch(gameCloseRequested());
            return;
        }

        dispatch(gameSendMessage('leavegame'));
        dispatch(gameCloseRequested());
    };

    if (!currentGame || !currentGame.started) {
        return null;
    }

    return (
        <div className={mobile ? 'grid gap-1' : 'flex items-center gap-1'}>
            <div
                className='relative'
                onMouseEnter={() => !mobile && setShowPopup(true)}
                onMouseLeave={() => !mobile && setShowPopup(false)}
            >
                <button
                    type='button'
                    className={itemClass}
                    onClick={() => mobile && setShowPopup((open) => !open)}
                >
                    {t('{{users}} spectators', { users: currentGame.spectators.length })}
                </button>
                {showPopup && (
                    <ul
                        className={
                            mobile
                                ? 'mt-1 rounded-md border border-border/70 bg-overlay/95 px-3 py-2 text-xs text-foreground'
                                : 'absolute left-0 top-full z-50 mt-1 min-w-30 rounded-md border border-border/70 bg-overlay/95 px-3 py-2 text-xs text-foreground'
                        }
                    >
                        {currentGame.spectators.map((spectator) => (
                            <li key={spectator.id}>{spectator.name}</li>
                        ))}
                    </ul>
                )}
            </div>
            {!isSpectating && (
                <button
                    type='button'
                    className={itemClass}
                    onClick={() => dispatch(gameSendMessage('concede'))}
                >
                    {t('Concede')}
                </button>
            )}
            <button type='button' className={itemClass} onClick={onLeaveClick}>
                {t('Leave Game')}
            </button>
        </div>
    );
};

export default GameContextMenu;
