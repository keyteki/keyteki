import React from 'react';
import { Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Profile from '../Components/Profile/Profile';
import { updateProfile, clearApiStatus } from '../redux/actions';
import ApiStatus from '../Components/Site/ApiStatus';

const ProfileContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const authState = useSelector((state) => state.auth);
    const apiState = useSelector((state) => {
        const retState = state.api['SAVE_PROFILE'];

        if (retState?.success) {
            retState.message = t(
                'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
            );

            setTimeout(() => {
                dispatch(clearApiStatus('SAVE_PROFILE'));
            }, 5000);
        }

        return retState;
    });

    if (!authState?.user) {
        return <Alert variant='danger'>{t('You need to be logged in to view your profile')}</Alert>;
    }

    return (
        <Col lg={{ span: 10, offset: 1 }}>
            <ApiStatus state={apiState} onClose={() => dispatch(clearApiStatus('SAVE_PROFILE'))} />
            <Profile
                user={authState.user}
                onSubmit={(profile) => {
                    return dispatch(updateProfile(authState.user.username, profile));
                }}
                isLoading={apiState?.loading}
            />
        </Col>
    );
};

export default ProfileContainer;
