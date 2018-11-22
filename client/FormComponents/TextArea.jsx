import React from 'react';
import PropTypes from 'prop-types';

class TextArea extends React.Component {
    render() {
        return (
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <textarea
                        ref={ this.props.name }
                        rows={ this.props.rows }
                        className='form-control'
                        id={ this.props.name }
                        placeholder={ this.props.placeholder }
                        value={ this.props.value }
                        onChange={ this.props.onChange }
                        onBlur={ this.props.onBlur } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage } </span> : null }
                </div>
                { this.props.children }
            </div>
        );
    }
}

TextArea.displayName = 'TextArea';
TextArea.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.string,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default TextArea;
