import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useTranslation } from 'react-i18next';
import { Account } from '../redux/types';
import { clearApiStatus, forgotPassword } from '../redux/actions';
import Button from '../Components/HeroUI/Button';
import { Input } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import ApiStatus from '../Components/Site/ApiStatus';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiState = useSelector((state) => {
        const retState = state.api[Account.ForgotPasswordRequest];

        if (retState && retState.success) {
            retState.message = t(
                'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
            );

            setTimeout(() => {
                dispatch(clearApiStatus(Account.ForgotPasswordRequest));
            }, 3000);
        }

        return retState;
    });

    const initialValues = {
        username: '',
        captchaValue: ''
    };

    const schema = yup.object({
        username: yup.string().required(t('You must enter your username or email address.')),
        captchaValue: yup.string().required(t('You must complete the captcha.')).nullable()
    });

    return (
        <div className='max-w-2xl mx-auto px-4'>
            <Panel title={t('Forgot password')}>
                {!apiState && (
                    <AlertPanel
                        type='info'
                        message={t(
                            'To start the password recovery process, please enter your username or email address and click the submit button.'
                        )}
                    />
                )}
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Account.ForgotPasswordRequest))}
                />
                <Formik
                    validationSchema={schema}
                    onSubmit={(values) => {
                        dispatch(
                            forgotPassword({
                                username: values.username,
                                captcha: values.captchaValue
                            })
                        );
                    }}
                    initialValues={initialValues}
                >
                    {(formProps) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                formProps.handleSubmit(event);
                            }}
                        >
                            <div className='mb-4'>
                                <Input
                                    label={t('Username')}
                                    name='username'
                                    type='text'
                                    placeholder={t('Enter your username or email address')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    isInvalid={
                                        formProps.touched.username && !!formProps.errors.username
                                    }
                                    errorMessage={formProps.errors.username}
                                />
                            </div>
                            <div className='mb-4'>
                                <ReCAPTCHA
                                    sitekey='6LdMGfYUAAAAAJN_sqZOBPn0URaFkWQ1QXvQqBbj'
                                    theme='dark'
                                    onChange={(value) =>
                                        formProps.setFieldValue('captchaValue', value, true)
                                    }
                                />
                                {formProps.errors.captchaValue && (
                                    <span className='text-danger text-xs'>
                                        {formProps.errors.captchaValue}
                                    </span>
                                )}
                            </div>
                            <div className='text-center'>
                                <Button color='primary' type='submit'>
                                    {t('Submit')}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Panel>
        </div>
    );
};

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
