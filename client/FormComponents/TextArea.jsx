import React from 'react';

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
    children: React.PropTypes.object,
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    name: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    rows: React.PropTypes.string,
    validationMessage: React.PropTypes.string,
    value: React.PropTypes.string
};

export default TextArea;
