import React from 'react';
import PropTypes from 'prop-types';

class ConfirmedButton extends React.Component {
    constructor() {
        super();

        this.state = {
            showConfirm: false
        };

        this.handleInitialClick = this.handleInitialClick.bind(this);
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
    }

    handleInitialClick(event) {
        event.preventDefault();
        this.setState({ showConfirm: true });
    }

    handleConfirmClick(event) {
        this.props.onClick(event);
        this.setState({ showConfirm: false });
    }

    render() {
        return (
            <span>
                <button className='btn btn-primary' onClick={ this.handleInitialClick }>{ this.props.children }</button>
                { this.state.showConfirm &&
                    <button className='btn btn-danger' onClick={ this.handleConfirmClick }>Confirm</button>
                }
            </span>);
    }
}

ConfirmedButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default ConfirmedButton;
