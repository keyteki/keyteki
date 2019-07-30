import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from './AlertPanel';

class ApiStatus extends React.Component {
    render() {
        if(!this.props.apiState || this.props.apiState.loading) {
            return null;
        }

        let error;
        if(typeof this.props.apiState.message === 'object') {
            error = (<ul>
                { Object.values(this.props.apiState.message).map(message => {
                    return <li>{ message }</li>;
                }) }
            </ul>);
        } else {
            error = this.props.apiState.message;
        }

        return (<div>
            { this.props.apiState.success || <AlertPanel type='error' multiLine>{ error }</AlertPanel> }
            { this.props.successMessage && <AlertPanel type='success' message={ this.props.successMessage } /> }
        </div>);
    }
}

ApiStatus.displayName = 'ApiStatus';
ApiStatus.propTypes = {
    apiState: PropTypes.object,
    successMessage: PropTypes.string
};

export default ApiStatus;
