import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';

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
    autoFocus: React.PropTypes.bool,
    children: React.PropTypes.object,
    dropup: React.PropTypes.bool,
    emptyLabel: React.PropTypes.string,
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    labelKey: React.PropTypes.string,
    minLength: React.PropTypes.number,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onInputChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    options: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    submitFormOnEnter: React.PropTypes.bool,
    validationMessage: React.PropTypes.string,
    value: React.PropTypes.string
};

export default Input;
