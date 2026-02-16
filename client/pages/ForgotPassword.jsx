import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input, Label } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import { useForgotPasswordMutation } from '../redux/api';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const hcaptchaSiteKey =
        import.meta.env.VITE_HCAPTCHA_SITEKEY || '10000000-ffff-ffff-ffff-000000000001';
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
        <div className='mx-auto w-full max-w-2xl'>
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
                            className='space-y-3'
                        >
                            <div>
                                <Label className='sr-only' htmlFor='username'>
                                    {t('Username')}
                                </Label>
                                <Input
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder={t('Username')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    variant='secondary'
                                    className='w-full'
                                />
                                {formProps.touched.username && formProps.errors.username ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.username}
                                    </div>
                                ) : null}
                            </div>

                            <div>
                                <HCaptcha
                                    sitekey={hcaptchaSiteKey}
                                    theme='dark'
                                    onVerify={(value) =>
                                        formProps.setFieldValue('captchaValue', value, true)
                                    }
                                    onExpire={() =>
                                        formProps.setFieldValue('captchaValue', '', true)
                                    }
                                />
                                {formProps.errors.captchaValue ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.captchaValue}
                                    </div>
                                ) : null}
                            </div>

                            <div className='pt-1'>
                                <Button type='submit' variant='secondary'>
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
