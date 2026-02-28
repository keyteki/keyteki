import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input, Label, toast } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Link from '../Components/Navigation/Link.jsx';
import { useRegisterAccountMutation } from '../redux/api';

import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [registerAccount, registerState] = useRegisterAccountMutation();
    const accountRegistered = registerState.isSuccess;

    useEffect(() => {
        if (!accountRegistered) {
            return;
        }

        toast.success(
            t('Your account was successfully registered.  You can now proceed to login.')
        );
        navigate('/login');
    }, [accountRegistered, navigate, t]);

    const errorBar = registerState.isError ? (
        <AlertPanel
            type='error'
            message={t(registerState.error?.data?.message || 'Registration failed')}
        />
    ) : null;
    const schema = yup.object({
        username: yup
            .string()
            .required(t('You must specify a username'))
            .min(3, t('Username must be at least 3 characters and no more than 15 characters long'))
            .max(
                15,
                t('Username must be at least 3 characters and no more than 15 characters long')
            )
            .matches(
                /^[A-Za-z0-9_-]+$/,
                t('Usernames must only use the characters a-z, 0-9, _ and -')
            ),
        email: yup
            .string()
            .required(t('You must specify an email address'))
            .matches(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                t('Please enter a valid email address')
            ),
        password: yup
            .string()
            .required(t('You must specify a password'))
            .min(6, t('Password must be at least 6 characters')),
        password1: yup
            .string()
            .required(t('You must confirm your password'))
            .oneOf([yup.ref('password'), null], t('The passwords you have entered do not match'))
    });
    const initialValues = { username: '', email: '', password: '', password1: '' };

    return (
        <div className='mx-auto w-full max-w-2xl'>
            {errorBar}
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
                    validationSchema={schema}
                    onSubmit={(values) =>
                        registerAccount({
                            username: values.username,
                            password: values.password,
                            email: values.email
                        })
                    }
                    initialValues={initialValues}
                >
                    {(formProps) => (
                        <form onSubmit={formProps.handleSubmit} className='space-y-3'>
                            <div>
                                <Label className='sr-only' htmlFor='username'>
                                    {t('Username')}
                                </Label>
                                <Input
                                    id='username'
                                    name='username'
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    placeholder={t('Username')}
                                    variant='tertiary'
                                    className='w-full'
                                />
                                {formProps.touched.username && formProps.errors.username ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.username}
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <Label className='sr-only' htmlFor='email'>
                                    {t('Email Address')}
                                </Label>
                                <Input
                                    id='email'
                                    name='email'
                                    value={formProps.values.email}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    placeholder={t('Email Address')}
                                    variant='tertiary'
                                    className='w-full'
                                />
                                {formProps.touched.email && formProps.errors.email ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.email}
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <Label className='sr-only' htmlFor='password'>
                                    {t('Password')}
                                </Label>
                                <Input
                                    id='password'
                                    name='password'
                                    type='password'
                                    value={formProps.values.password}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    placeholder={t('Password')}
                                    variant='tertiary'
                                    className='w-full'
                                />
                                {formProps.touched.password && formProps.errors.password ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.password}
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <Label className='sr-only' htmlFor='password1'>
                                    {t('Password (again)')}
                                </Label>
                                <Input
                                    id='password1'
                                    name='password1'
                                    type='password'
                                    value={formProps.values.password1}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    placeholder={t('Password (again)')}
                                    variant='tertiary'
                                    className='w-full'
                                />
                                {formProps.touched.password1 && formProps.errors.password1 ? (
                                    <div className='mt-1 text-sm text-red-300'>
                                        {formProps.errors.password1}
                                    </div>
                                ) : null}
                            </div>
                            <div className='pt-1'>
                                <Button
                                    type='submit'
                                    variant='primary'
                                    isPending={registerState.isLoading}
                                >
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
