import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

class Security extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsLoaded: false
        };
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        if (this.props.user) {
            this.props.loadActiveSessions(this.props.user);

            this.setState({ detailsLoaded: true });
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (!this.state.detailsLoaded && props.user) {
            this.props.loadActiveSessions(props.user);

            this.setState({ detailsLoaded: true });
        }
    }

    onRemoveClick(session, event) {
        let t = this.props.t;

        event.preventDefault();

        if (!this.props.user) {
            return;
        }

        toastr.confirm(
            t(
                'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.'
            ),
            {
                okText: t('Ok'),
                cancelText: t('Cancel'),
                onOk: () => {
                    this.props.removeSession(this.props.user.username, session.id);
                }
            }
        );
    }

    render() {
        let t = this.props.t;
        let content;
        let successPanel;

        if (this.props.sessionRemoved) {
            setTimeout(() => {
                this.props.clearSessionStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message={t('Session removed successfully')} type={'success'} />
            );
        }

        let sessions = this.props.sessions
            ? this.props.sessions.map((session) => {
                  return (
                      <tr key={session.id}>
                          <td>{session.ip}</td>
                          <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                          <td>
                              <a
                                  href='#'
                                  onClick={this.onRemoveClick.bind(this, session)}
                                  className='btn'
                              >
                                  <span className='glyphicon glyphicon-remove' />
                              </a>
                          </td>
                      </tr>
                  );
              })
            : null;
        let table =
            this.props.sessions && this.props.sessions.length === 0 ? (
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
                    <tbody>{sessions}</tbody>
                </table>
            );

        if (this.props.loading) {
            content = (
                <div>
                    <Trans>Loading session details from the server...</Trans>
                </div>
            );
        } else if (this.props.apiError) {
            content = <AlertPanel type='error' message={this.props.apiError} />;
        } else {
            content = (
                <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                    {successPanel}
                    <Panel title={t('Active Sessions')}>
                        <p className='help-block'>
                            <Trans i18nKey='security.note'>
                                Below you will see the active &quot;sessions&quot; that you have on
                                the website. If you see any unexpected activity on your account,
                                remove the session and consider changing your password.
                            </Trans>
                        </p>
                        {table}
                    </Panel>
                </div>
            );
        }

        return content;
    }
}

Security.displayName = 'Security';
Security.propTypes = {
    apiError: PropTypes.string,
    clearSessionStatus: PropTypes.func,
    i18n: PropTypes.object,
    loadActiveSessions: PropTypes.func,
    loading: PropTypes.bool,
    removeSession: PropTypes.func,
    sessionRemoved: PropTypes.bool,
    sessions: PropTypes.array,
    t: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        loading: state.api.loading,
        sessionRemoved: state.user.sessionRemoved,
        sessions: state.user.sessions,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Security));
