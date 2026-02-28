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
                <HeroModal.Dialog className='w-full max-w-md'>
                    <HeroModal.CloseTrigger />
                    <HeroModal.Header>
                        <HeroModal.Heading className='text-foreground/92'>
                            {passwordGame.name}
                        </HeroModal.Heading>
                    </HeroModal.Header>
                    <HeroModal.Body className='w-full min-w-0 overflow-visible'>
                        {passwordError && <AlertPanel type='danger' message={t(passwordError)} />}
                        <div className='w-full min-w-0 space-y-2'>
                            <h3 className='text-base font-medium text-foreground/85'>
                                <Trans>Enter the password</Trans>
                            </h3>
                            <form
                                className='w-full min-w-0'
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    onJoin();
                                }}
                            >
                                <Input
                                    autoFocus
                                    className='w-full min-w-0 max-w-full [&_[data-slot="input"]]:!text-foreground [&_[data-slot="input"]]:placeholder:!text-foreground/52 [&_[data-slot="input-wrapper"]]:!w-full [&_[data-slot="input-wrapper"]]:!min-w-0 [&_[data-slot="input-wrapper"]]:!max-w-full [&_[data-slot="input-wrapper"]]:!border [&_[data-slot="input-wrapper"]]:!border-black/20 [&_[data-slot="input-wrapper"]]:!bg-white [&_[data-slot="input-wrapper"]]:!shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]'
                                    type='password'
                                    placeholder={t('Password')}
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </form>
                        </div>
                    </HeroModal.Body>
                    <HeroModal.Footer>
                        <Button variant='primary' onPress={onJoin}>
                            {t(passwordJoinType)}
                        </Button>
                        <Button
                            variant='tertiary'
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
