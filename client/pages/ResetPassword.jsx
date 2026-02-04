import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import { useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '../redux/api';

const ResetPassword = ({ id, token }) => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [resetPassword, resetState] = useResetPasswordMutation();
    const accountPasswordReset = resetState.isSuccess;

    useEffect(() => {
        if (!accountPasswordReset) {
            return;
        }

        setSuccessMessage(
            'Your password has been changed.  You will shortly be redirected to the login page.'
        );

        const timeoutId = setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timeoutId);
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
    const successBar = successMessage ? (
        <AlertPanel type='success' message={successMessage} />
    ) : null;

    return (
        <div>
            <div className='col-sm-6 col-sm-offset-3'>
                {errorBar}
                {successBar}
                <Panel title='Reset password'>
                    <Form
                        name='resetpassword'
                        apiLoading={resetState.isLoading}
                        buttonText='Submit'
                        onSubmit={(state) =>
                            resetPassword({
                                id,
                                token,
                                newPassword: state.password
                            })
                        }
                    />
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
