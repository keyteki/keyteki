import React from 'react';

class Select extends React.Component {
    render() {
        var options = [];

        if(this.props.blankOption) {
            var value = this.props.blankOption[this.props.valueKey || 'value'];
            var name = this.props.blankOption[this.props.nameKey || 'name'];
            
            options.push(<option key='default' value={ value }>{ name }</option>);
        }

        this.props.options.forEach(option => {
            var value = option[this.props.valueKey || 'value'];
            var name = option[this.props.nameKey || 'name'];
            
            options.push(<option key={ value } value={ value }>{ name }</option>);
        });

        return (        
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label'}>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <select ref={ this.props.name } className='form-control' id={ this.props.name } value={ this.props.value }
                        onChange={ this.props.onChange } onBlur={ this.props.onBlur }>
                        { options }
                    </select>
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage} </span> : null }
                </div>
            </div>
        );
    }
}

Select.displayName = 'Select';
Select.propTypes = {
    blankOption: React.PropTypes.object,
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    name: React.PropTypes.string,
    nameKey: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    options: React.PropTypes.array,
    type: React.PropTypes.oneOf(['text']),
    validationMessage: React.PropTypes.string,
    value: React.PropTypes.string,
    valueKey: React.PropTypes.string
};

export default Select;
