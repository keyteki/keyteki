// @ts-nocheck
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '@heroui/react';
import Button from '../HeroUI/Button';

import formFields from './formFields.json';

const Form = ({ name, children, buttonClass, apiLoading, buttonText, onSubmit }) => {
    const { t } = useTranslation();
    const fields = formFields[name] || [];

    const initialValues = useMemo(() => {
        const init = {};
        fields.forEach((f) => {
            init[f.name] = '';
        });
        return init;
    }, [fields]);

    const validationSchema = useMemo(() => {
        const shape = {};
        const fieldNames = fields.map((f) => f.name);
        fields.forEach((f) => {
            const vp = f.validationProperties || {};
            let s = yup.string();
            if (vp['data-val-required']) {
                s = s.required(t(vp['data-val-required']));
            }
            if (vp['data-val-length-min']) {
                const msg = vp['data-val-length'] ? t(vp['data-val-length']) : undefined;
                s = s.min(vp['data-val-length-min'], msg);
            }
            if (vp['data-val-length-max']) {
                const msg = vp['data-val-length'] ? t(vp['data-val-length']) : undefined;
                s = s.max(vp['data-val-length-max'], msg);
            }
            if (vp['data-val-regex-pattern']) {
                const msg = vp['data-val-regex'] ? t(vp['data-val-regex']) : undefined;
                s = s.matches(new RegExp(vp['data-val-regex-pattern']), msg);
            }
            if (vp['data-val-equalto-other']) {
                let other = vp['data-val-equalto-other'];
                if (!fieldNames.includes(other)) {
                    if (fieldNames.includes('newPassword')) other = 'newPassword';
                }
                const msg = vp['data-val-equalto'] ? t(vp['data-val-equalto']) : undefined;
                s = s.oneOf([yup.ref(other)], msg);
            }
            shape[f.name] = s;
        });
        return yup.object(shape);
    }, [fields, t]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await onSubmit?.(values);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {(formProps) => (
                <form
                    className='space-y-4'
                    onSubmit={(event) => {
                        event.preventDefault();
                        formProps.handleSubmit(event);
                    }}
                >
                    {fields.map((field) => {
                        const vp = field.validationProperties || {};
                        const maxLength = vp.maxLength;
                        const name = field.name;
                        const type = field.inputType === 'password' ? 'password' : 'text';
                        const error = formProps.errors[name];
                        const touched = formProps.touched[name];
                        return (
                            <div key={name} className='flex flex-col gap-1'>
                                <Input
                                    label={t(field.label)}
                                    name={name}
                                    type={type}
                                    placeholder={t(field.placeholder)}
                                    value={formProps.values[name]}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    isInvalid={touched && !!error}
                                    errorMessage={error}
                                    maxLength={maxLength}
                                />
                            </div>
                        );
                    })}
                    {children}
                    <div className={buttonClass || ''}>
                        <Button color='primary' type='submit' isLoading={apiLoading}>
                            {t(buttonText) || t('Submit')}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
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
