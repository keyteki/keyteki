import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

class OptionsSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: (this.props.options.length > 0 ? '' + this.props.options[0].arg : '')
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
                    { this.props.options.map(option => <option key={ option.arg }>{ option.text }</option>) }
                </select>
                <button className='btn btn-default prompt-button btn-stretch option-button' onClick={ this.onDoneClicked }>{ this.props.t('Done') }</button>
            </div>);
    }
}

OptionsSelect.displayName = 'OptionsSelect';
OptionsSelect.propTypes = {
    i18n: PropTypes.object,
    onOptionSelected: PropTypes.func,
    options: PropTypes.array,
    t: PropTypes.func
};

export default withTranslation()(OptionsSelect);
