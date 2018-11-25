import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';

import * as actions from '../actions';

class Activation extends React.Component {
    constructor() {
        super();

        this.state = {
        };
    }

    componentWillMount() {
        this.props.activateAccount({ id: this.props.id, token: this.props.token });
    }

    componentWillReceiveProps(props) {
        if(props.accountActivated) {
            this.setState({ successMessage: 'Your account has been activated.  You will shortly be redirected to the login page.' });

            setTimeout(() => {
                this.props.navigate('/login');
            }, 3000);
        }
    }

    render() {
        if(!this.props.id || !this.props.token) {
            return <AlertPanel type='error' message='This page is not intended to be viewed directly.  Please click on the link in your email to activate your account' />;
        }

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;
        let successBar = this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null;

        return (
            <div>
                <div className='col-sm-6 col-sm-offset-3'>
                    { errorBar }
                    { successBar }
                </div>
            </div>);
    }
}

Activation.propTypes = {
    accountActivated: PropTypes.bool,
    activateAccount: PropTypes.func,apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    id: PropTypes.string,
    navigate: PropTypes.func,
    token: PropTypes.string
};
Activation.displayName = 'Activation';

function mapStateToProps(state) {
    return {
        accountActivated: state.account.activated,
        apiLoading: state.api.ACTIVATE_ACCOUNT ? state.api.ACTIVATE_ACCOUNT.loading : undefined,
        apiMessage: state.api.ACTIVATE_ACCOUNT ? state.api.ACTIVATE_ACCOUNT.message : undefined,
        apiSuccess: state.api.ACTIVATE_ACCOUNT ? state.api.ACTIVATE_ACCOUNT.success : undefined
    };
}

export default connect(mapStateToProps, actions)(Activation);
