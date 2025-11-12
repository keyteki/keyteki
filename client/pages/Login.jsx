import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToast, Input, Link } from '@heroui/react';
import { Formik } from 'formik';

import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import Button from '../Components/HeroUI/Button';
import Page from './Page';
import NavigationLink from '../Components/Site/NavigationLink';
import { useLoginMutation } from '../redux/slices/apiSlice';
import { sendAuthenticate } from '../redux/slices/lobbySlice';
import { accountLoggedIn } from '../redux/slices/authSlice';
import { navigate } from '../redux/slices/navigationSlice';

const Login = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loginAccount, { isLoading }] = useLoginMutation();

    const onLogin = useCallback(
        async (state) => {
            try {
                const response = await loginAccount({
                    username: state.username,
                    password: state.password
                }).unwrap();

                console.info(response);

                dispatch(accountLoggedIn(response.user, response.token, response.refreshToken));
                dispatch(sendAuthenticate(response.token));

                addToast({
                    color: 'success',
                    description: t('You have logged in successfully')
                });

                dispatch(navigate('/'));
            } catch (err) {
                addToast({
                    color: 'danger',
                    description:
                        err.message || t('An error occured logging in. Please try again later.')
                });
            }
        },
        [dispatch, loginAccount]
    );

    const schema = yup.object({
        username: yup.string().required(t('You must specify a username')),
        password: yup.string().required(t('You must specify a password'))
    });

    return (
        <Page size='small'>
            <Panel title={t('Login')}>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={schema}
                    onSubmit={onLogin}
                >
                    {(formProps) => (
                        <form onSubmit={formProps.handleSubmit} className='flex flex-col gap-2'>
                            <Input
                                label={t('Username')}
                                {...formProps.getFieldProps('username')}
                                isInvalid={formProps.errors.username && formProps.touched.username}
                                errorMessage={formProps.errors.username}
                            />
                            <div>
                                <Input
                                    label={t('Password')}
                                    type='password'
                                    isInvalid={
                                        formProps.errors.password && formProps.touched.password
                                    }
                                    errorMessage={formProps.errors.password}
                                    {...formProps.getFieldProps('password')}
                                />
                                <Link href='/forgot' as={NavigationLink}>
                                    Forgot your password?
                                </Link>
                            </div>
                            <Button
                                className='sm:self-start'
                                isLoading={isLoading}
                                type='submit'
                                color='primary'
                            >
                                {t('Login')}
                            </Button>
                        </form>
                    )}
                </Formik>
            </Panel>
        </Page>
    );
};

export default Login;
