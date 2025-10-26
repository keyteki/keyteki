// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { Button } from '@heroui/react';

import Input from './Input.jsx';

import formFields from './formFields.json';

import { useTranslation } from 'react-i18next';

const Form = ({ name, children, buttonClass, apiLoading, buttonText, onSubmit }) => {
    const { t } = useTranslation();
    const [state, setState] = useState({});
    const formRef = useRef(null);
    const validatorRef = useRef(null);

    useEffect(() => {
        $.validator.unobtrusive.parse('form');
        validatorRef.current = $('form').validate();

        return () => {
            if (validatorRef.current) {
                validatorRef.current.destroy();
            }
        };
    }, []);

    const onChange = useCallback((field, event) => {
        setState((prev) => ({ ...prev, [field]: event.target.value }));
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

    const fieldsToRender = useMemo(() => {
        return formFields[name].map((field) => (
            <Input
                key={field.name}
                name={field.name}
                label={t(field.label)}
                placeholder={t(field.placeholder)}
                validationAttributes={translateValidationProps(field)}
                fieldClass={field.fieldClass}
                labelClass={field.labelClass}
                type={field.inputType}
                onChange={(e) => onChange(field.name, e)}
                value={state[field.name]}
            />
        ));
    }, [name, state, t, translateValidationProps, onChange]);

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            if (!$('form').valid()) return;
            if (onSubmit) {
                onSubmit(state);
            }
        },
        [onSubmit, state]
    );

    return (
        <form ref={formRef} className='form form-horizontal' onSubmit={handleSubmit}>
            {fieldsToRender}
            {children}
            <div className='form-group'>
                <div className={buttonClass || 'col-sm-offset-4 col-sm-3'}>
                    <Button color='primary' type='submit' isLoading={apiLoading}>
                        {t(buttonText) || t('Submit')}
                    </Button>
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
