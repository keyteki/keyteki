import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Profile from '../Components/Profile/Profile';
import { saveProfile, clearApiStatus } from '../redux/actions';
import ApiStatus from '../Components/Site/ApiStatus';
import AlertPanel, { AlertType } from '../Components/Site/AlertPanel';

const ProfileContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
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

    if (!user) {
        return (
            <AlertPanel
                type={AlertType.Danger}
                message={t('You need to be logged in to view your profile')}
            />
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4'>
            <ApiStatus state={apiState} onClose={() => dispatch(clearApiStatus('SAVE_PROFILE'))} />
            <Profile
                user={user}
                onSubmit={(profile) => {
                    return dispatch(saveProfile(user.username, profile));
                }}
                isLoading={apiState?.loading}
            />
        </div>
    );
};

export default ProfileContainer;
