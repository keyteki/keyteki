import React from 'react';

class Checkbox extends React.Component {
    render() {
        return (
            <div className='form-group'>
                <div className={ 'checkbox ' + this.props.fieldClass }>
                    <label htmlFor={ this.props.name } className={ this.props.labelClass }>
                        <input type='checkbox'
                            ref={ this.props.name }
                            id={ this.props.name }
                            checked={ this.props.checked }
                            onChange={ this.props.onChange } />
                        { this.props.label }
                    </label>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
    checked: React.PropTypes.bool,
    children: React.PropTypes.object,
    fieldClass: React.PropTypes.string,
    label: React.PropTypes.string,
    labelClass: React.PropTypes.string,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func
};

export default Checkbox;
