import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input, Modal as HeroModal } from '@heroui/react';

import AlertPanel from '../Site/AlertPanel';
import { lobbyActions } from '../../redux/slices/lobbySlice';
import { lobbySendMessage } from '../../redux/socketActions';

const PasswordGame = () => {
    const { t } = useTranslation();
    const { passwordError, passwordJoinType, passwordGame } = useSelector((state) => ({
        passwordError: state.lobby.passwordError,
        passwordGame: state.lobby.passwordGame,
        passwordJoinType: state.lobby.passwordJoinType
    }));
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (passwordGame) {
            setPassword('');
        }
    }, [passwordGame]);

    if (!passwordGame) {
        return null;
    }

    const onJoin = () => {
        dispatch(
            lobbySendMessage(
                passwordJoinType === 'Join' ? 'joingame' : 'watchgame',
                passwordGame.id,
                password
            )
        );
    };

    return (
        <HeroModal.Backdrop
            isOpen={!!passwordGame}
            onOpenChange={() => dispatch(lobbyActions.cancelPasswordJoin())}
        >
            <HeroModal.Container placement='center'>
                <HeroModal.Dialog className='sm:max-w-md'>
                    <HeroModal.CloseTrigger />
                    <HeroModal.Header>
                        <HeroModal.Heading>{passwordGame.name}</HeroModal.Heading>
                    </HeroModal.Header>
                    <HeroModal.Body>
                        {passwordError && <AlertPanel type='danger' message={t(passwordError)} />}
                        <div className='space-y-2'>
                            <h3 className='text-base font-medium text-zinc-100'>
                                <Trans>Enter the password</Trans>
                            </h3>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    onJoin();
                                }}
                            >
                                <Input
                                    autoFocus
                                    type='password'
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </form>
                        </div>
                    </HeroModal.Body>
                    <HeroModal.Footer>
                        <Button variant='tertiary' onPress={onJoin}>
                            {t(passwordJoinType)}
                        </Button>
                        <Button
                            variant='danger'
                            onPress={() => dispatch(lobbyActions.cancelPasswordJoin())}
                        >
                            <Trans>Cancel</Trans>
                        </Button>
                    </HeroModal.Footer>
                </HeroModal.Dialog>
            </HeroModal.Container>
        </HeroModal.Backdrop>
    );
};

PasswordGame.displayName = 'PasswordGame';

export default PasswordGame;
