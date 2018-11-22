import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    clear() {
        this.refs.typeahead.getInstance().clear();
    }

    render() {
        let label = this.props.label ? <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label> : null;
        return (
            <div className='form-group'>
                { label }
                <div className={ this.props.fieldClass }>
                    <Typeahead ref='typeahead' options={ this.props.options } labelKey={ this.props.labelKey } emptyLabel={ this.props.emptyLabel }
                        onChange={ this.props.onChange } placeholder={ this.props.placeholder } autoFocus={ this.props.autoFocus } dropup={ this.props.dropup }
                        minLength={ this.props.minLength } onInputChange={ this.props.onInputChange }
                        submitFormOnEnter={ this.props.submitFormOnEnter } onKeyDown={ this.props.onKeyDown } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage } </span> : null }
                </div>
                { this.props.children }
            </div>
        );
    }
}

Input.displayName = 'TypeAhead';
Input.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.object,
    dropup: PropTypes.bool,
    emptyLabel: PropTypes.string,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    labelKey: PropTypes.string,
    minLength: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    submitFormOnEnter: PropTypes.bool,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default Input;
