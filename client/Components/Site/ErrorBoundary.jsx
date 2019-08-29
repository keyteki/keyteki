import React from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

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

    componentDidCatch(error, errorInfo) {
        this.setState({ error });

        Sentry.withScope(scope => {
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({eventId});
        });
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
                onClick={ () => Sentry.showReportDialog({ eventId: this.state.eventId }) }>
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
