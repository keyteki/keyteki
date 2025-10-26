import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';

import { navigate, resetPassword as doResetPassword } from '../redux/actions';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState('');

    const api = useSelector((state) => state.api.RESETPASSWORD_ACCOUNT);
    const accountPasswordReset = useSelector((state) => state.account.passwordReset);

    const apiLoading = api ? api.loading : undefined;
    const apiSuccess = api ? api.success : undefined;
    const apiMessage = api ? api.message : undefined;

    useEffect(() => {
        if (accountPasswordReset) {
            setSuccessMessage(
                'Your password has been changed.  You will shortly be redirected to the login page.'
            );
            const id = setTimeout(() => {
                dispatch(navigate('/login'));
            }, 3000);
            return () => clearTimeout(id);
        }
    }, [accountPasswordReset, dispatch]);

    const onSubmit = useCallback(
        (formState) => {
            dispatch(
                doResetPassword({
                    id,
                    token,
                    newPassword: formState.password
                })
            );
        },
        [dispatch, id, token]
    );

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
                        onSubmit={onSubmit}
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
