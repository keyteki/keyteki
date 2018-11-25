import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    render() {
        const inputControl = (
            <div>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <input name={ this.props.name } type={ this.props.type } className='form-control' id={ this.props.name }
                        placeholder={ this.props.placeholder } value={ this.props.value } onChange={ this.props.onChange } onBlur={ this.props.onBlur }
                        { ...this.props.validationAttributes } />
                    <span className='text-danger' data-valmsg-replace='true' data-valmsg-for={ this.props.name } />
                </div>
                { this.props.children }
            </div>
        );

        if(this.props.noGroup) {
            return inputControl;
        }

        return (
            <div className='form-group'>
                { inputControl }
            </div>
        );
    }
}

Input.displayName = 'Input';
Input.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    noGroup: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password']),
    validationAttributes: PropTypes.object,
    value: PropTypes.string
};

export default Input;
