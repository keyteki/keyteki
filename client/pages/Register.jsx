import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Form from '../Components/Form/Form.jsx';
import Link from '../Components/Navigation/Link.jsx';

import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

export class Register extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);

        this.state = {
            successMessage: '',
            enableGravatar: true
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        let t = this.props.t;

        if (props.accountRegistered) {
            // this.setState({ successMessage: 'Your account was successfully registered.  Please verify your account using the link in the email sent to the address you have provided.' });
            this.setState({
                successMessage: t(
                    'Your account was successfully registered.  You can now process to login.'
                )
            });
            setTimeout(() => {
                //    this.props.navigate('/');
                this.props.navigate('/login');
            }, 2000);
        }
    }

    onRegister(state) {
        this.props.registerAccount({
            username: state.username,
            password: state.password,
            email: state.email,
            enableGravatar: state.enableGravatar
        });
    }

    onEnableGravatarChanged(event) {
        this.setState({ enableGravatar: event.target.checked });
    }

    render() {
        let t = this.props.t;

        let errorBar =
            this.props.apiSuccess === false ? (
                <AlertPanel type='error' message={t(this.props.apiMessage)} />
            ) : null;
        let successBar = this.state.successMessage ? (
            <AlertPanel type='success' message={t(this.state.successMessage)} />
        ) : null;

        return (
            <div className='col-md-8 col-md-offset-2'>
                {errorBar}
                {successBar}
                <Panel title={t('Register an account')}>
                    <Trans i18nKey='register.disclosure'>
                        <p>
                            We require information from you in order to service your access to the
                            site. Please see the <Link href='/privacy'>privacy policy</Link> for
                            details on why we need this information and what we do with it. Please
                            pay particular attention to the section on avatars.
                        </p>
                    </Trans>

                    <Form
                        name='register'
                        apiLoading={this.props.apiLoading}
                        buttonText='Register'
                        onSubmit={this.onRegister}
                    />
                </Panel>
            </div>
        );
    }
}

Register.displayName = 'Register';
Register.propTypes = {
    accountRegistered: PropTypes.bool,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    i18n: PropTypes.object,
    navigate: PropTypes.func,
    register: PropTypes.func,
    registerAccount: PropTypes.func,
    registeredToken: PropTypes.string,
    registeredUser: PropTypes.object,
    socket: PropTypes.object,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        accountRegistered: state.account.registered,
        apiLoading: state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.loading : undefined,
        apiMessage: state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.message : undefined,
        apiSuccess: state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.success : undefined,
        socket: state.lobby.socket
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Register));
