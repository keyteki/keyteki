import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Form from '../Components/Form/Form.jsx';
import Link from '../Components/Site/Link.jsx';

import * as actions from '../actions';

export class Register extends React.Component {
    constructor() {
        super();

        this.onRegister = this.onRegister.bind(this);

        this.state = {
            successMessage: '',
            enableGravatar: true
        };
    }

    componentWillReceiveProps(props) {
        if(props.accountRegistered) {
            this.setState({ successMessage: 'Your account was successfully registered.  Please verify your account using the link in the email sent to the address you have provided.' });

            setTimeout(() => {
                this.props.navigate('/');
            }, 2000);
        }
    }

    onRegister(state) {
        this.props.registerAccount({ username: state.username, password: state.password, email: state.email, enableGravatar: state.enableGravatar });
    }

    onEnableGravatarChanged(event) {
        this.setState({ enableGravatar: event.target.checked });
    }

    render() {
        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;
        let successBar = this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null;

        return (
            <div className='col-md-8 col-md-offset-2'>
                { errorBar }
                { successBar }
                <Panel title='Register an account'>
                    <p>We require information from you in order to service your access to the site.  Please see the <Link href='/privacy'>privacy policy</Link> for details on why we need this information and what we do with it.  Please pay particular attention to the section on avatars.</p>

                    <Form name='register' apiLoading={ this.props.apiLoading } buttonText='Register' onSubmit={ this.onRegister } />
                </Panel>
            </div>);
    }
}

Register.displayName = 'Register';
Register.propTypes = {
    accountRegistered: PropTypes.bool,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    navigate: PropTypes.func,
    register: PropTypes.func,
    registerAccount: PropTypes.func,
    registeredToken: PropTypes.string,
    registeredUser: PropTypes.object,
    socket: PropTypes.object
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

export default connect(mapStateToProps, actions)(Register);
