// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
    name,
    label,
    labelClass = '',
    fieldClass,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    autoFocus,
    validationAttributes,
    noGroup,
    children
}) => {
    const inputControl = (
        <div>
            <label htmlFor={name} className={labelClass + ' control-label'}>
                {label}
            </label>
            <div className={fieldClass}>
                <input
                    name={name}
                    type={type}
                    className='form-control'
                    id={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                    {...validationAttributes}
                />
                <span className='text-danger' data-valmsg-replace='true' data-valmsg-for={name} />
            </div>
            {children}
        </div>
    );

    if (noGroup) {
        return inputControl;
    }

    return <div className='form-group'>{inputControl}</div>;
};

Input.displayName = 'Input';
Input.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
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
