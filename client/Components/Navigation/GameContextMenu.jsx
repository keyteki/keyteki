import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { sendGameMessage, closeGameSocket } from '../../redux/actions';
import { useState } from 'react';

import './GameContextMenu.scss';

const GameContextMenu = () => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);

    const isSpectating = !currentGame?.players[user?.username];

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

        let otherPlayer = Object.values(currentGame.players).find((player) => {
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
            toastr.confirm(
                t(
                    'Your game is not finished. If you leave you will concede the game. Are you sure you want to leave?'
                ),
                {
                    okText: t('Ok'),
                    cancelText: t('Cancel'),
                    onOk: () => {
                        dispatch(sendGameMessage('concede'));
                        dispatch(sendGameMessage('leavegame'));
                        dispatch(closeGameSocket());
                    }
                }
            );

            return;
        }

        dispatch(sendGameMessage('leavegame'));
        dispatch(closeGameSocket());
    };

    if (!currentGame || !currentGame.started) {
        return null;
    }

    const spectators = currentGame.spectators.map((spectator) => {
        return <li key={spectator.id}>{spectator.name}</li>;
    });
    let spectatorPopup = <ul className='spectators-popup mt-5 absolute-panel'>{spectators}</ul>;

    return (
        <>
            <li
                onMouseOver={() => setShowPopup(true)}
                onMouseOut={() => setShowPopup(false)}
                className='navbar-item'
            >
                <span>{t('{{users}} spectators', { users: currentGame.spectators.length })}</span>
            </li>
            {showPopup && spectatorPopup}
            {!isSpectating && (
                <li className='navbar-item'>
                    <Nav.Link
                        onClick={() => dispatch(sendGameMessage('concede'))}
                        className='navbar-item interactable'
                    >
                        <span>
                            <Trans>Concede</Trans>
                        </span>
                    </Nav.Link>
                </li>
            )}
            <li className='navbar-item'>
                <Nav.Link onClick={onLeaveClick} className='navbar-item interactable'>
                    <Trans>Leave Game</Trans>
                </Nav.Link>
            </li>
        </>
    );
};

export default GameContextMenu;
