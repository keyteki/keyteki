import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';

import * as actions from '../redux/actions';

class Logout extends React.Component {
    componentDidMount() {
        this.props.logout();
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.loggedOut) {
            this.props.navigate('/');
        }
    }

    render() {
        let errorBar =
            this.props.apiSuccess === false ? (
                <AlertPanel type='error' message={this.props.apiMessage} />
            ) : null;

        return (
            <div className='col-sm-6 col-sm-offset-3'>
                {errorBar}
                Logging you out of your account, please wait..
            </div>
        );
    }
}

Logout.displayName = 'Logout';
Logout.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    loggedOut: PropTypes.bool,
    logout: PropTypes.func,
    navigate: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.LOGOUT_ACCOUNT ? state.api.LOGOUT_ACCOUNT.loading : undefined,
        apiMessage: state.api.LOGOUT_ACCOUNT ? state.api.LOGOUT_ACCOUNT.message : undefined,
        apiSuccess: state.api.LOGOUT_ACCOUNT ? state.api.LOGOUT_ACCOUNT.success : undefined,
        loggedOut: state.account.loggedOut
    };
}

export default connect(mapStateToProps, actions)(Logout);
