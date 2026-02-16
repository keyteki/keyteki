import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import { useForgotPasswordMutation } from '../redux/api';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [forgotPassword, forgotState] = useForgotPasswordMutation();

    const apiState = forgotState.isUninitialized
        ? null
        : {
              loading: forgotState.isLoading,
              success: forgotState.isSuccess,
              message: forgotState.isSuccess
                  ? t(
                        'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
                    )
                  : forgotState.error?.data?.message
          };

    React.useEffect(() => {
        if (forgotState.isSuccess) {
            const timeoutId = setTimeout(() => {
                forgotState.reset();
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [forgotState]);

    const initialValues = {
        username: '',
        captchaValue: ''
    };

    const schema = yup.object({
        username: yup.string().required(t('You must enter your username or email address.')),
        captchaValue: yup.string().required(t('You must complete the captcha.')).nullable()
    });

    return (
        <div className='mx-auto w-full max-w-[720px]'>
            <Panel title={t('Forgot password')}>
                {!apiState ? (
                    <AlertPanel
                        type='info'
                        message={t(
                            'To start the password recovery process, please enter your username or email address and click the submit button.'
                        )}
                    />
                ) : null}
                <ApiStatus state={apiState} onClose={() => forgotState.reset()} />
                <Formik
                    validationSchema={schema}
                    onSubmit={(values) => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        forgotPassword({
                            username: values.username,
                            captcha: values.captchaValue
                        });
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
                            <div className='max-w-[520px]'>
                                <label
                                    className='mb-1 block text-sm text-zinc-200'
                                    htmlFor='username'
                                >
                                    {t('Username')}
                                </label>
                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder={t('Enter your username or email address')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                                />
                                {formProps.touched.username && formProps.errors.username ? (
                                    <div className='mt-1 text-xs text-red-300'>
                                        {formProps.errors.username}
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-3 max-w-[520px]'>
                                <ReCAPTCHA
                                    className='is-invalid'
                                    sitekey='6LdMGfYUAAAAAJN_sqZOBPn0URaFkWQ1QXvQqBbj'
                                    theme='dark'
                                    onChange={(value) =>
                                        formProps.setFieldValue('captchaValue', value, true)
                                    }
                                />
                                {formProps.errors.captchaValue ? (
                                    <div className='mt-1 text-xs text-red-300'>
                                        {formProps.errors.captchaValue}
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-3 text-center'>
                                <button
                                    type='submit'
                                    className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                                >
                                    {t('Submit')}
                                </button>
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
