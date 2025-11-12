import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Link from '../Components/Navigation/Link.jsx';
import Button from '../Components/HeroUI/Button';

import { navigate } from '../redux/slices/navigationSlice';
import { useRegisterMutation } from '../redux/slices/apiSlice';

const Register = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accountRegistered = useSelector((state) => state.account.registered);
    const [registerAccount, { isLoading, error, isSuccess }] = useRegisterMutation();

    useEffect(() => {
        if (accountRegistered || isSuccess) {
            const timer = setTimeout(() => {
                dispatch(navigate('/login'));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [accountRegistered, isSuccess, dispatch]);

    const validationSchema = yup.object({
        username: yup.string().required(t('Username is required')),
        email: yup
            .string()
            .email(t('Please enter a valid email address'))
            .required(t('Email is required')),
        password: yup
            .string()
            .min(8, t('Password must be at least 8 characters'))
            .required(t('Password is required')),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], t('Passwords must match'))
            .required(t('Please confirm your password'))
    });

    return (
        <div className='max-w-3xl mx-auto'>
            {error && (
                <AlertPanel
                    type='error'
                    title=''
                    message={t(error.message || 'Registration failed')}
                >
                    {null}
                </AlertPanel>
            )}
            {(accountRegistered || isSuccess) && (
                <AlertPanel
                    type='success'
                    title=''
                    message={t(
                        'Your account was successfully registered.  You can now proceed to login.'
                    )}
                >
                    {null}
                </AlertPanel>
            )}
            <Panel title={t('Register an account')}>
                <Trans i18nKey='register.disclosure'>
                    <p>
                        We require information from you in order to service your access to the site.
                        Please see the <Link href='/privacy'>privacy policy</Link> for details on
                        why we need this information and what we do with it. Please pay particular
                        attention to the section on avatars.
                    </p>
                </Trans>

                <Formik
                    initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await registerAccount({
                                username: values.username,
                                password: values.password,
                                email: values.email
                            }).unwrap();
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {(form) => (
                        <form
                            className='space-y-4'
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(e);
                            }}
                        >
                            <div className='flex flex-col gap-1'>
                                <Input
                                    label={t('Username')}
                                    name='username'
                                    value={form.values.username}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    isInvalid={form.touched.username && !!form.errors.username}
                                    errorMessage={form.errors.username}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Input
                                    label={t('Email')}
                                    name='email'
                                    type='email'
                                    value={form.values.email}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    isInvalid={form.touched.email && !!form.errors.email}
                                    errorMessage={form.errors.email}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Input
                                    label={t('Password')}
                                    name='password'
                                    type='password'
                                    value={form.values.password}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    isInvalid={form.touched.password && !!form.errors.password}
                                    errorMessage={form.errors.password}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Input
                                    label={t('Confirm password')}
                                    name='confirmPassword'
                                    type='password'
                                    value={form.values.confirmPassword}
                                    onChange={form.handleChange}
                                    onBlur={form.handleBlur}
                                    isInvalid={
                                        form.touched.confirmPassword &&
                                        !!form.errors.confirmPassword
                                    }
                                    errorMessage={form.errors.confirmPassword}
                                />
                            </div>
                            <div>
                                <Button color='primary' type='submit' isLoading={isLoading}>
                                    {t('Register')}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Panel>
        </div>
    );
};

Register.displayName = 'Register';

export default Register;
