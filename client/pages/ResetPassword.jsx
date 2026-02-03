import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import { useNavigate } from 'react-router-dom';

import { resetPassword } from '../redux/actions';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const { accountPasswordReset, apiLoading, apiMessage, apiSuccess } = useSelector((state) => ({
        accountPasswordReset: state.account.passwordReset,
        apiLoading: state.api.RESETPASSWORD_ACCOUNT
            ? state.api.RESETPASSWORD_ACCOUNT.loading
            : undefined,
        apiMessage: state.api.RESETPASSWORD_ACCOUNT
            ? state.api.RESETPASSWORD_ACCOUNT.message
            : undefined,
        apiSuccess: state.api.RESETPASSWORD_ACCOUNT
            ? state.api.RESETPASSWORD_ACCOUNT.success
            : undefined
    }));

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

    const errorBar = apiSuccess === false ? <AlertPanel type='error' message={apiMessage} /> : null;
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
                        apiLoading={apiLoading}
                        buttonText='Submit'
                        onSubmit={(state) =>
                            dispatch(
                                resetPassword({
                                    id,
                                    token,
                                    newPassword: state.password
                                })
                            )
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
