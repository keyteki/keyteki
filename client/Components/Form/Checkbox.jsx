import React from 'react';
import PropTypes from 'prop-types';

class Checkbox extends React.Component {
    render() {
        var checkBox = (
            <div className={'checkbox ' + this.props.fieldClass}>
                <label htmlFor={this.props.name} className={this.props.labelClass}>
                    <input
                        type='checkbox'
                        ref={this.props.name}
                        id={this.props.name}
                        checked={this.props.checked}
                        onChange={this.props.onChange}
                    />
                    {this.props.label}
                </label>
                {this.props.children}
            </div>
        );

        if (this.props.noGroup) {
            return checkBox;
        }

        return <div className='form-group'>{checkBox}</div>;
    }
}

Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    noGroup: PropTypes.bool,
    onChange: PropTypes.func
};

export default Checkbox;
