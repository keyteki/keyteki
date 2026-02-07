import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetActiveSessionsQuery, useRemoveSessionMutation } from '../redux/api';
import { userActions } from '../redux/slices/userSlice';

import { Trans, useTranslation } from 'react-i18next';

const Security = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [detailsLoaded, setDetailsLoaded] = useState(false);
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
            const timeoutId = setTimeout(() => {
                dispatch(userActions.clearSessionStatus());
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [dispatch, sessionRemoved]);

    const onRemoveClick = useCallback(
        (session, event) => {
            event.preventDefault();

            if (!user) {
                return;
            }

            const confirmed = window.confirm(
                t(
                    'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.'
                )
            );

            if (confirmed) {
                removeSession({ username: user.username, sessionId: session.id });
            }
        },
        [removeSession, t, user]
    );

    const successPanel = sessionRemoved ? (
        <AlertPanel message={t('Session removed successfully')} type='success' />
    ) : null;

    const table =
        sessions && sessions.length === 0 ? (
            <div>You have no active sessions. This shouldn&quot;t really happen.</div>
        ) : (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>
                            <Trans>IP Address</Trans>
                        </th>
                        <th>
                            <Trans>Last Used</Trans>
                        </th>
                        <th>
                            <Trans>Remove</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sessions?.map((session) => (
                        <tr key={session.id}>
                            <td>{session.ip}</td>
                            <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                            <td>
                                <a
                                    href='#'
                                    onClick={(event) => onRemoveClick(session, event)}
                                    className='text-danger'
                                >
                                    <FontAwesomeIcon icon={faTimes} />
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
        <div className='col-sm-8 col-sm-offset-2 profile full-height'>
            {successPanel}
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
        </div>
    );
};

Security.displayName = 'Security';

export default Security;
