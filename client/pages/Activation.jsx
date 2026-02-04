import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AlertPanel from '../Components/Site/AlertPanel';
import { useActivateAccountMutation } from '../redux/api';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import ApiStatus from '../Components/Site/ApiStatus';

const Activation = ({ id, token }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activateAccount, activateState] = useActivateAccountMutation();

    useEffect(() => {
        if (activateState.isSuccess) {
            const timeoutId = setTimeout(() => {
                activateState.reset();
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [activateState, navigate]);

    const apiState = activateState.isUninitialized
        ? null
        : {
              loading: activateState.isLoading,
              success: activateState.isSuccess,
              message: activateState.isSuccess
                  ? t(
                        'Your account has been activated.  You will shortly be redirected to the login page.'
                    )
                  : activateState.error?.data?.message
          };
    useEffect(() => {
        if (id && token) {
            activateAccount({ id, token });
        }
    }, [activateAccount, id, token]);

    if (!id || !token) {
        return (
            <AlertPanel
                type='danger'
                message={t(
                    'This page is not intended to be viewed directly.  Please click on the link in your email to activate your account'
                )}
            />
        );
    }

    return (
        <div>
            <Col sm={{ span: 6, offset: 3 }}>
                <ApiStatus state={apiState} onClose={() => activateState.reset()} />
            </Col>
        </div>
    );
};

Activation.displayName = 'Activation';

export default Activation;
