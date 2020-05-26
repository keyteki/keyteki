import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';

class Patreon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        if (!this.props.code) {
            return;
        }

        this.props.linkPatreon(this.props.code);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.accountLinked) {
            this.setState({
                successMessage:
                    'Your account was linked successfully.  Sending you back to the profile page.'
            });

            setTimeout(() => {
                this.props.clearLinkStatus();
                this.props.navigate('/profile');
            }, 5000);
        }
    }

    render() {
        if (!this.props.code) {
            return (
                <AlertPanel
                    type='error'
                    message='This page is not intended to be viewed directly.  Please click on one of the links at the top of the page or your browser back button to return to the site.'
                />
            );
        }

        return (
            <div>
                <ApiStatus
                    apiState={this.props.apiState}
                    successMessage={this.state.successMessage}
                />
                {this.props.apiState.loading && (
                    <div>Please wait while we verify your details..</div>
                )}
            </div>
        );
    }
}

Patreon.propTypes = {
    accountLinked: PropTypes.bool,
    apiState: PropTypes.object,
    clearLinkStatus: PropTypes.func,
    code: PropTypes.string.isRequired,
    linkPatreon: PropTypes.func,
    navigate: PropTypes.func
};
Patreon.displayName = 'Patreon';

function mapStateToProps(state) {
    return {
        accountLinked: state.account.accountLinked,
        apiState: state.api.ACCOUNT_LINK_REQUEST || {}
    };
}

export default connect(mapStateToProps, actions)(Patreon);
