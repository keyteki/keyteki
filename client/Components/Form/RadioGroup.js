import React from 'react';
import PropTypes from 'prop-types';

import RadioButton from './RadioButton';

class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = { selectedButton: undefined};
    }

    onRadioButtonClick(button) {
        this.setState({ selectedButton: button });

        if(this.props.onValueSelected) {
            this.props.onValueSelected(button.value);
        }
    }

    isButtonSelected(button) {
        if(!button || !this.state.selectedButton) {
            return false;
        }

        return this.state.selectedButton.value === button.value;
    }

    render() {
        let buttons = this.props.buttons.map(button => {
            return <RadioButton key={ button.value } name={ button.value } label={ button.label } onClick={ this.onRadioButtonClick.bind(this, button) } selected={ this.isButtonSelected(button) } />;
        });

        return (<div>
            { buttons }
        </div>);
    }
}

RadioGroup.displayName = 'RadioGroup';
RadioGroup.propTypes = {
    buttons: PropTypes.array.isRequired,
    onValueSelected: PropTypes.func
};

export default RadioGroup;
