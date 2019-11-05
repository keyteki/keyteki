import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Link from '../Components/Site/Link';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import * as actions from '../actions';

import { withTranslation, Trans } from 'react-i18next';

class Login extends React.Component {
    constructor() {
        super();

        this.onLogin = this.onLogin.bind(this);
    }

    componentWillReceiveProps(props) {
        if(props.loggedIn) {
            this.props.authenticateSocket();

            this.props.navigate('/');
        }
    }

    onLogin(state) {
        this.props.loginAccount({ username: state.username, password: state.password });
    }

    render() {
        let t = this.props.t;
        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ t(this.props.apiMessage) } /> : null;

        return (
            <div className='col-md-6 col-md-offset-3'>
                { errorBar }
                <Panel title={ t('Login') }>
                    <Form name='login' apiLoading={ this.props.apiLoading } buttonText={ 'Log In' } onSubmit={ this.onLogin } buttonClass='col-sm-offset-2 col-sm-3'>
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-10'>
                                <Link href='/forgot'><Trans>Forgot your password?</Trans></Link>
                            </div>
                        </div>
                    </Form>
                </Panel>
            </div>);
    }
}

Login.displayName = 'Login';
Login.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    authenticateSocket: PropTypes.func,
    i18n: PropTypes.object,
    loggedIn: PropTypes.bool,
    loggedInToken: PropTypes.string,
    loggedInUser: PropTypes.object,
    login: PropTypes.func,
    loginAccount: PropTypes.func,
    navigate: PropTypes.func,
    socket: PropTypes.object,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.LOGIN_ACCOUNT ? state.api.LOGIN_ACCOUNT.loading : undefined,
        apiMessage: state.api.LOGIN_ACCOUNT ?
            state.api.LOGIN_ACCOUNT.status === 401 ? 'Invalid username or password.  Please check and try again' : state.api.LOGIN_ACCOUNT.message : undefined,
        apiSuccess: state.api.LOGIN_ACCOUNT ? state.api.LOGIN_ACCOUNT.success : undefined,
        loggedIn: state.account.loggedIn,
        loggedInToken: state.auth.token,
        loggedInUser: state.account.loggedInUser,
        socket: state.lobby.socket
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Login));
