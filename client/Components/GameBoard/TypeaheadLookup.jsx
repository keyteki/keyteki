import React from 'react';
import PropTypes from 'prop-types';

import Typeahead from '../Form/Typeahead';

class TypeaheadLookup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDoneClick = this.handleDoneClick.bind(this);
    }

    handleChange(value) {
        this.setState({ selectedValue: value[0] });
    }

    handleDoneClick() {
        if (this.props.onValueSelected) {
            this.props.onValueSelected(this.state.selectedValue);
        }
    }

    render() {
        return (
            <div>
                <Typeahead
                    labelKey={'label'}
                    options={this.props.values}
                    dropup
                    onChange={this.handleChange}
                />
                <button type='button' onClick={this.handleDoneClick} className='btn btn-primary'>
                    Done
                </button>
            </div>
        );
    }
}

TypeaheadLookup.displayName = 'TypeaheadLookup';
TypeaheadLookup.propTypes = {
    onValueSelected: PropTypes.func,
    values: PropTypes.array
};

export default TypeaheadLookup;
