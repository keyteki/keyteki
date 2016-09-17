import React from 'react';

class Input extends React.Component {
    render() {
        return (
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label'}>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <input type={ this.props.type }
                        ref={ this.props.name }
                        className='form-control'
                        id={ this.props.name }
                        placeholder={ this.props.placeholder }
                        value={ this.props.value }
                        onChange={ this.props.onChange }
                        onBlur={ this.props.onBlur } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage} </span> : null }
                </div>
            </div>
        );
    }
}

Input.displayName = 'Input';
Input.propTypes = {
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    name: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.oneOf(['text']),
    validationMessage: React.PropTypes.string,
    value: React.PropTypes.string
};

export default Input;
