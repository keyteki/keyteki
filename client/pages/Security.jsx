import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from '../Components/Icon';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal as HeroModal, toast } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetActiveSessionsQuery, useRemoveSessionMutation } from '../redux/api';
import { userActions } from '../redux/slices/userSlice';

import { Trans, useTranslation } from 'react-i18next';

const Security = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [detailsLoaded, setDetailsLoaded] = useState(false);
    const [sessionToRemove, setSessionToRemove] = useState(null);
    const user = useSelector((state) => state.account.user);
    const sessionRemoved = useSelector((state) => state.user.sessionRemoved);
    const sessions = useSelector((state) => state.user.sessions);
    const { isLoading, isError, error } = useGetActiveSessionsQuery(user?.username, {
        skip: !user
    });
    const [removeSession] = useRemoveSessionMutation();

    useEffect(() => {
        if (!detailsLoaded && user) {
            setDetailsLoaded(true);
        }
    }, [detailsLoaded, user]);

    useEffect(() => {
        if (sessionRemoved) {
            toast.success(t('Session removed successfully'));
            dispatch(userActions.clearSessionStatus());
        }
    }, [dispatch, sessionRemoved, t]);

    const onRemoveClick = useCallback(
        (session, event) => {
            event.preventDefault();

            if (!user) {
                return;
            }

            setSessionToRemove(session);
        },
        [user]
    );

    const onConfirmRemoveSession = useCallback(() => {
        if (!user || !sessionToRemove) {
            return;
        }

        removeSession({ username: user.username, sessionId: sessionToRemove.id });
        setSessionToRemove(null);
    }, [removeSession, sessionToRemove, user]);

    const table =
        sessions && sessions.length === 0 ? (
            <div>You have no active sessions. This shouldn&quot;t really happen.</div>
        ) : (
            <table className='w-full border-collapse text-left text-sm text-zinc-100'>
                <thead>
                    <tr className='border-b border-zinc-600/70'>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>IP Address</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Last Used</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Remove</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody className='[&>tr:nth-child(odd)]:bg-black/20 [&>tr>td]:px-2 [&>tr>td]:py-1.5'>
                    {sessions?.map((session) => (
                        <tr key={session.id}>
                            <td>{session.ip}</td>
                            <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                            <td>
                                <a
                                    href='#'
                                    onClick={(event) => onRemoveClick(session, event)}
                                    className='text-red-400 hover:text-red-300'
                                >
                                    <Icon icon={faTimes} />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );

    if (isLoading) {
        return (
            <div>
                <Trans>Loading session details from the server...</Trans>
            </div>
        );
    }

    if (isError) {
        return <AlertPanel type='error' message={error?.data?.message} />;
    }

    return (
        <div className='profile mx-auto min-h-full w-full max-w-5xl'>
            <Panel title={t('Active Sessions')}>
                <p className='help-block'>
                    <Trans i18nKey='security.note'>
                        Below you will see the active &quot;sessions&quot; that you have on the
                        website. If you see any unexpected activity on your account, remove the
                        session and consider changing your password.
                    </Trans>
                </p>
                {table}
            </Panel>
            <HeroModal.Backdrop
                isOpen={!!sessionToRemove}
                onOpenChange={() => setSessionToRemove(null)}
            >
                <HeroModal.Container placement='center'>
                    <HeroModal.Dialog className='sm:max-w-md'>
                        <HeroModal.CloseTrigger />
                        <HeroModal.Header>
                            <HeroModal.Heading>{t('Remove session')}</HeroModal.Heading>
                        </HeroModal.Header>
                        <HeroModal.Body>
                            <p className='text-sm text-foreground/88'>
                                {t(
                                    'Are you sure you want to remove this session? It will be logged out and any games in progress may be abandoned.'
                                )}
                            </p>
                        </HeroModal.Body>
                        <HeroModal.Footer>
                            <Button variant='danger' onPress={onConfirmRemoveSession}>
                                <Trans>Remove</Trans>
                            </Button>
                            <Button variant='tertiary' onPress={() => setSessionToRemove(null)}>
                                <Trans>Cancel</Trans>
                            </Button>
                        </HeroModal.Footer>
                    </HeroModal.Dialog>
                </HeroModal.Container>
            </HeroModal.Backdrop>
        </div>
    );
};

Security.displayName = 'Security';

export default Security;
