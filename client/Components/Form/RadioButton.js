import React from 'react';
import PropTypes from 'prop-types';

class RadioButton extends React.Component {
    render() {
        return (
            <label className='radio-inline'>
                <input
                    name={this.props.name}
                    type='radio'
                    onClick={this.props.onClick}
                    checked={!!this.props.selected}
                />
                {this.props.label}
            </label>
        );
    }
}

RadioButton.displayName = 'RadioButton';
RadioButton.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool
};

export default RadioButton;
