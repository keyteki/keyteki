import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input, Label, toast } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '../redux/api';

const ResetPassword = ({ id, token }) => {
    const navigate = useNavigate();
    const [resetPassword, resetState] = useResetPasswordMutation();
    const accountPasswordReset = resetState.isSuccess;

    useEffect(() => {
        if (!accountPasswordReset) {
            return;
        }

        toast.success('Your password has been changed.');
        navigate('/login');
    }, [accountPasswordReset, navigate]);

    if (!id || !token) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password'
            />
        );
    }

    const errorBar = resetState.isError ? (
        <AlertPanel
            type='error'
            message={resetState.error?.data?.message || 'Unable to reset password'}
        />
    ) : null;
    const schema = yup.object({
        password: yup
            .string()
            .required('You must specify a password')
            .min(6, 'Password must be at least 6 characters'),
        password1: yup
            .string()
            .required('You must confirm your password')
            .oneOf([yup.ref('password'), null], 'The passwords you have entered do not match')
    });
    const initialValues = { password: '', password1: '' };

    return (
        <div>
            <div className='mx-auto w-full max-w-3xl'>
                {errorBar}
                <Panel title='Reset password'>
                    <Formik
                        validationSchema={schema}
                        onSubmit={(values) =>
                            resetPassword({
                                id,
                                token,
                                newPassword: values.password
                            })
                        }
                        initialValues={initialValues}
                    >
                        {(formProps) => (
                            <form onSubmit={formProps.handleSubmit} className='space-y-3'>
                                <div>
                                    <Label
                                        className='mb-1 block text-sm text-zinc-200'
                                        htmlFor='password'
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id='password'
                                        name='password'
                                        type='password'
                                        value={formProps.values.password}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        placeholder='Enter a password'
                                        variant='tertiary'
                                    />
                                    {formProps.touched.password && formProps.errors.password ? (
                                        <div className='mt-1 text-xs text-red-300'>
                                            {formProps.errors.password}
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <Label
                                        className='mb-1 block text-sm text-zinc-200'
                                        htmlFor='password1'
                                    >
                                        Password (again)
                                    </Label>
                                    <Input
                                        id='password1'
                                        name='password1'
                                        type='password'
                                        value={formProps.values.password1}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        placeholder='Enter your password again'
                                        variant='tertiary'
                                    />
                                    {formProps.touched.password1 && formProps.errors.password1 ? (
                                        <div className='mt-1 text-xs text-red-300'>
                                            {formProps.errors.password1}
                                        </div>
                                    ) : null}
                                </div>
                                <div className='pt-1'>
                                    <Button
                                        type='submit'
                                        variant='primary'
                                        isPending={resetState.isLoading}
                                    >
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
