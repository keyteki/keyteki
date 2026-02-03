import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import Input from './Input.jsx';

import formFields from './formFields.json';

import { useTranslation } from 'react-i18next';

const Form = (props) => {
    const { t } = useTranslation();
    const [values, setValues] = useState({});
    const validatorRef = useRef(null);

    useEffect(() => {
        $.validator.unobtrusive.parse('form');
        validatorRef.current = $('form').validate();

        return () => {
            validatorRef.current?.destroy();
        };
    }, []);

    const onChange = useCallback((field, event) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: event.target.value
        }));
    }, []);

    const translateValidationProps = useCallback(
        (field) => {
            let validationAttributes = {};

            if (field.validationProperties) {
                for (let key of Object.keys(field.validationProperties)) {
                    if (
                        key === 'data-val-required' ||
                        key === 'data-val-length' ||
                        key === 'data-val-equalto' ||
                        key === 'data-val-regex'
                    ) {
                        validationAttributes[key] = t(field.validationProperties[key]);
                    } else {
                        validationAttributes[key] = field.validationProperties[key];
                    }
                }
            }

            return validationAttributes;
        },
        [t]
    );

    const onSubmit = useCallback(
        (event) => {
            event.preventDefault();

            if (!$('form').valid()) {
                return;
            }

            if (props.onSubmit) {
                props.onSubmit(values);
            }
        },
        [props, values]
    );

    const fieldsToRender = useMemo(
        () =>
            formFields[props.name].map((field) => (
                <Input
                    key={field.name}
                    name={field.name}
                    label={t(field.label)}
                    placeholder={t(field.placeholder)}
                    validationAttributes={translateValidationProps(field)}
                    fieldClass={field.fieldClass}
                    labelClass={field.labelClass}
                    type={field.inputType}
                    onChange={(event) => onChange(field.name, event)}
                    value={values[field.name]}
                />
            )),
        [onChange, props.name, t, translateValidationProps, values]
    );

    return (
        <form className='form form-horizontal' onSubmit={onSubmit}>
            {fieldsToRender}
            {props.children}
            <div className='form-group'>
                <div className={props.buttonClass || 'col-sm-offset-4 col-sm-3'}>
                    <button type='submit' className='btn btn-primary' disabled={props.apiLoading}>
                        {t(props.buttonText) || t('Submit')}{' '}
                        {props.apiLoading ? <span className='spinner button-spinner' /> : null}
                    </button>
                </div>
            </div>
        </form>
    );
};

Form.displayName = 'Form';
Form.propTypes = {
    apiLoading: PropTypes.bool,
    buttonClass: PropTypes.string,
    buttonText: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func
};

export default Form;
