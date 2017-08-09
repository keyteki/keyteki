import Typeahead from 'react-bootstrap-typeahead';
import React from 'react';

class Input extends React.Component {
    render() {
        return (
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <Typeahead ref={ this.props.name }
                        options={ this.props.options }
                        labelKey={ this.props.labelKey }
                        onChange={ this.props.onChange } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage } </span> : null }
                </div>
                { this.props.children }
            </div>
        );
    }
}

Input.displayName = 'TypeAhead';
Input.propTypes = {
    children: React.PropTypes.object,
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    labelKey: React.PropTypes.string,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    options: React.PropTypes.array,
    validationMessage: React.PropTypes.string,
    value: React.PropTypes.string
};

export default Input;
