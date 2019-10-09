import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation, Trans } from 'react-i18next';

class ConfirmedButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirm: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.setState({ showConfirm: !this.state.showConfirm });
    }

    handleConfirmClick(event) {
        this.props.onClick(event);
        this.setState({ showConfirm: false });
    }

    render() {
        return (
            <span>
                <button className='btn btn-danger' onClick={ this.handleClick }>{ this.props.children }</button>
                { this.state.showConfirm &&
                    <button className='btn btn-danger' onClick={ this.handleConfirmClick }><Trans>Confirm</Trans></button>
                }
            </span>);
    }
}

ConfirmedButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func
};

export default withTranslation()(ConfirmedButton);
