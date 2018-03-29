import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            errorPath: props.errorPath
        };

        this.onReturnClick = this.onReturnClick.bind(this);
    }

    componentWillReceiveProps(props) {
        if(props.errorPath !== this.state.errorPath) {
            this.setState({ error: null, errorPath: props.errorPath });
        }
    }

    componentDidCatch(error, info) {
        this.setState({ error });

        Raven.captureException(error, { extra: info });
    }

    onReturnClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({error: null});
        this.props.navigate('/');
    }

    render() {
        if(this.state.error) {
            return (<div
                className='alert alert-danger'
                onClick={ () => Raven.lastEventId() && Raven.showReportDialog() }>
                <p>{ this.props.message }</p>
                <p>There error has been logged, please click anywhere in this red box to fill out a more detailed report.</p>

                { this.props.navigate &&
                    <p>Click <a href='#' onClick={ this.onReturnClick }>here</a> to clear the error and return to the home page</p> }
            </div>);
        }

        return this.props.children;
    }
}

ErrorBoundary.displayName = 'ErrorBoundary';
ErrorBoundary.propTypes = {
    children: PropTypes.node,
    errorPath: PropTypes.string,
    message: PropTypes.string,
    navigate: PropTypes.func
};

export default ErrorBoundary;
