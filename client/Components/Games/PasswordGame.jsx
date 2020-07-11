import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';

import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { cancelPasswordJoin, sendSocketMessage } from '../../redux/actions';

const PasswordGame = () => {
    const { t } = useTranslation();
    const { passwordError, passwordJoinType, passwordGame } = useSelector((state) => ({
        passwordError: state.lobby.passwordError,
        passwordGame: state.lobby.passwordGame,
        passwordJoinType: state.lobby.passwordJoinType
    }));
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    if (!passwordGame) {
        return null;
    }

    return (
        <div>
            <Panel title={passwordGame.name}>
                {passwordError && <AlertPanel type='danger' message={t(passwordError)} />}
                <h3>
                    <Trans>Enter the password</Trans>
                </h3>
                <div className='mt-1 mb-3'>
                    <input
                        className='form-control'
                        type='password'
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                </div>
                <div className='text-center'>
                    <Button
                        variant='primary'
                        onClick={() => {
                            dispatch(
                                sendSocketMessage(
                                    passwordJoinType === 'Join' ? 'joingame' : 'watchgame',
                                    passwordGame.id,
                                    password
                                )
                            );
                        }}
                    >
                        {t(passwordJoinType)}
                    </Button>
                    <Button variant='danger' onClick={() => dispatch(cancelPasswordJoin())}>
                        <Trans>Cancel</Trans>
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

PasswordGame.displayName = 'PasswordGame';

export default PasswordGame;
