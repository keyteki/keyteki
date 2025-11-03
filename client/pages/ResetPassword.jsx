import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '@heroui/react';

import { useDispatch } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Button from '../Components/HeroUI/Button';

import { navigate } from '../redux/slices/navigationSlice';
import { useResetPasswordMutation } from '../redux/slices/apiSlice';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();
    const [resetPassword, { isLoading, isSuccess, error, reset }] = useResetPasswordMutation();

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                dispatch(navigate('/login'));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, dispatch]);

    const onSubmit = useCallback(
        async (formState) => {
            try {
                await resetPassword({
                    id,
                    token,
                    newPassword: formState.password
                }).unwrap();
            } catch (err) {
                // Error handled by AlertPanel
            }
        },
        [resetPassword, id, token]
    );

    if (!id || !token) {
        return (
            <AlertPanel
                type='error'
                title=''
                message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password'
            >
                {null}
            </AlertPanel>
        );
    }

    const validationSchema = yup.object({
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Please confirm your password')
    });

    return (
        <div>
            <div className='max-w-lg mx-auto'>
                {error && (
                    <AlertPanel
                        type='error'
                        title=''
                        message={error.message || 'An error occurred'}
                        onClose={reset}
                    >
                        {null}
                    </AlertPanel>
                )}
                {isSuccess && (
                    <AlertPanel
                        type='success'
                        title=''
                        message='Your password has been changed.  You will shortly be redirected to the login page.'
                        onClose={reset}
                    >
                        {null}
                    </AlertPanel>
                )}
                <Panel title='Reset password'>
                    <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                await onSubmit({ password: values.password });
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
                                        label='New password'
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
                                        label='Confirm new password'
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
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </Panel>
            </div>
        </div>
    );
};

ResetPassword.propTypes = {
    id: PropTypes.string,
    token: PropTypes.string
};
ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
