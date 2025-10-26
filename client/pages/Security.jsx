// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { loadActiveSessions, removeSession, clearSessionStatus } from '../redux/actions';

import { Trans, useTranslation } from 'react-i18next';
const Security = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [detailsLoaded, setDetailsLoaded] = useState(false);

    const { apiError, loading, sessionRemoved, sessions, user } = useSelector((state) => ({
        apiError: state.api.message,
        loading: state.api.loading,
        sessionRemoved: state.user.sessionRemoved,
        sessions: state.user.sessions,
        user: state.account.user
    }));

    useEffect(() => {
        if (!detailsLoaded && user) {
            dispatch(loadActiveSessions(user));
            setDetailsLoaded(true);
        }
    }, [detailsLoaded, user, dispatch]);

    useEffect(() => {
        if (sessionRemoved) {
            const to = setTimeout(() => {
                dispatch(clearSessionStatus());
            }, 5000);
            return () => clearTimeout(to);
        }
    }, [sessionRemoved, dispatch]);

    const onRemoveClick = useCallback(
        (session, event) => {
            event.preventDefault();
            if (!user) return;

            toastr.confirm(
                t(
                    'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.'
                ),
                {
                    okText: t('Ok'),
                    cancelText: t('Cancel'),
                    onOk: () => {
                        dispatch(removeSession(user.username, session.id));
                    }
                }
            );
        },
        [dispatch, t, user]
    );

    const sessionsRows = useMemo(() => {
        return sessions
            ? sessions.map((session) => (
                  <tr key={session.id}>
                      <td>{session.ip}</td>
                      <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                      <td>
                          <a
                              href='#'
                              onClick={(e) => onRemoveClick(session, e)}
                              className='text-danger'
                          >
                              <FontAwesomeIcon icon={faTimes} />
                          </a>
                      </td>
                  </tr>
              ))
            : null;
    }, [sessions, onRemoveClick]);

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
                <tbody>{sessionsRows}</tbody>
            </table>
        );

    if (loading) {
        return (
            <div>
                <Trans>Loading session details from the server...</Trans>
            </div>
        );
    }

    if (apiError) {
        return <AlertPanel type='error' message={apiError} />;
    }

    return (
        <div className='col-sm-8 col-sm-offset-2 profile full-height'>
            {sessionRemoved && (
                <AlertPanel message={t('Session removed successfully')} type={'success'} />
            )}
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
