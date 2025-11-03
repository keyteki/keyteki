import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Profile from '../Components/Profile/Profile';
import { useSaveProfileMutation } from '../redux/slices/apiSlice';
import AlertPanel, { AlertType } from '../Components/Site/AlertPanel';

const ProfileContainer = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [saveProfile, { isLoading, isSuccess, reset }] = useSaveProfileMutation();

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
            {isSuccess && (
                <div className='bg-green-600 text-white p-3 rounded mb-4'>
                    {t(
                        'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
                    )}
                    <button onClick={reset} className='float-right'>
                        ×
                    </button>
                </div>
            )}
            <Profile
                user={user}
                onSubmit={async (profile) => {
                    try {
                        await saveProfile({ username: user.username, details: profile }).unwrap();
                    } catch (err) {
                        // Error handled by RTK Query
                    }
                }}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ProfileContainer;
