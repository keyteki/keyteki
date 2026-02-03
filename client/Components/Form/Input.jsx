import React from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
    const inputControl = (
        <div>
            <label htmlFor={props.name} className={`${props.labelClass} control-label`}>
                {props.label}
            </label>
            <div className={props.fieldClass}>
                <input
                    name={props.name}
                    type={props.type}
                    className='form-control'
                    id={props.name}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    autoFocus={props.autoFocus}
                    {...props.validationAttributes}
                />
                <span
                    className='text-danger'
                    data-valmsg-replace='true'
                    data-valmsg-for={props.name}
                />
            </div>
            {props.children}
        </div>
    );

    if (props.noGroup) {
        return inputControl;
    }

    return <div className='form-group'>{inputControl}</div>;
};

Input.displayName = 'Input';
Input.propTypes = {
    autoFocus: PropTypes.bool,
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
Input.defaultProps = {
    labelClass: ''
};

export default Input;
