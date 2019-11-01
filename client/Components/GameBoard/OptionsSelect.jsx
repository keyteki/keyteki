import React from 'react';
import PropTypes from 'prop-types';

class OptionsSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onDoneClicked = this.onDoneClicked.bind(this);
    }

    onChange(event) {
        this.setState({ selectedOption: event.target.value });
    }

    onDoneClicked(event) {
        event.preventDefault();

        if(this.props.onOptionSelected) {
            this.props.onOptionSelected(this.state.selectedOption);
        }
    }

    render() {
        return (
            <div>
                <select className='form-control' onChange={ this.onChange }>
                    { this.props.options.map(option => <option key={ option.value }>{ option.text }</option>) }
                </select>
                <button className='btn btn-default prompt-button btn-stretch option-button' onClick={ this.onDoneClicked }>Done</button>
            </div>);
    }
}

OptionsSelect.displayName = 'OptionsSelect';
OptionsSelect.propTypes = {
    onOptionSelected: PropTypes.func,
    options: PropTypes.array
};

export default OptionsSelect;
