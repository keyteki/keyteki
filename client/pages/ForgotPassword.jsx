import React, { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordMutation } from '../redux/slices/apiSlice';
import Button from '../Components/HeroUI/Button';
import { Input } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [forgotPassword, { isLoading, isSuccess, reset }] = useForgotPasswordMutation();

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, reset]);

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
                {!isSuccess && (
                    <AlertPanel
                        type='info'
                        title=''
                        message={t(
                            'To start the password recovery process, please enter your username or email address and click the submit button.'
                        )}
                    >
                        {null}
                    </AlertPanel>
                )}
                {isSuccess && (
                    <AlertPanel
                        type='success'
                        title=''
                        message={t(
                            'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
                        )}
                        onClose={reset}
                    >
                        {null}
                    </AlertPanel>
                )}
                <Formik
                    validationSchema={schema}
                    onSubmit={async (values) => {
                        try {
                            await forgotPassword({
                                username: values.username,
                                captcha: values.captchaValue
                            }).unwrap();
                        } catch (err) {
                            // Error will be shown via toastr if present
                        }
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
                                <Button color='primary' type='submit' isLoading={isLoading}>
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
