import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';

import * as actions from '../actions';

class ResetPassword extends React.Component {
    constructor() {
        super();

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {};
    }

    componentWillReceiveProps(props) {
        if(props.accountPasswordReset) {
            this.setState({ successMessage: 'Your password has been changed.  You will shortly be redirected to the login page.' });

            setTimeout(() => {
                this.props.navigate('/login');
            }, 3000);
        }
    }

    onSubmit(state) {
        this.props.resetPassword({ id: this.props.id, token: this.props.token, newPassword: state.password });
    }

    render() {
        if(!this.props.id || !this.props.token) {
            return <AlertPanel type='error' message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password' />;
        }

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;
        let successBar = this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null;

        return (
            <div>
                <div className='col-sm-6 col-sm-offset-3'>
                    { errorBar }
                    { successBar }
                    <Panel title='Reset password'>
                        <Form name='resetpassword' apiLoading={ this.props.apiLoading } buttonText='Submit' onSubmit={ this.onSubmit } />
                    </Panel>
                </div>
            </div>);
    }
}

ResetPassword.propTypes = {
    accountPasswordReset: PropTypes.bool,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    id: PropTypes.string,
    navigate: PropTypes.func,
    resetPassword: PropTypes.func,
    token: PropTypes.string
};
ResetPassword.displayName = 'ResetPassword';

function mapStateToProps(state) {
    return {
        accountPasswordReset: state.account.passwordReset,
        apiLoading: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.RESETPASSWORD_ACCOUNT ? state.api.RESETPASSWORD_ACCOUNT.success : undefined
    };
}

export default connect(mapStateToProps, actions)(ResetPassword);
