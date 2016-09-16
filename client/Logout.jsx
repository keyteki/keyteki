import React from 'react';
import { withRouter } from 'react-router';
import $ from 'jquery';

import auth from './auth.js';

class Logout extends React.Component {
    componentWillMount() {
        $.ajax({
            url: '/api/account/logout',
            type: 'POST',
            contentType: 'application/json'
        }).always(() => {
            auth.logout();
            this.props.router.push('/');
        });
    }

    render() {
        return (<div>Logging out, please wait while you are redirected</div>);
    }
}

Logout.displayName = 'Logout';
Logout.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Logout, { withRef: true });
