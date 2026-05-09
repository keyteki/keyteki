import React from 'react';
import { toast } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Profile from '../Components/Profile/Profile';
import { useSaveProfileMutation } from '../redux/api';
import ApiStatus from '../Components/Site/ApiStatus';
import AlertPanel from '../Components/Site/AlertPanel';

const ProfileContainer = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [saveProfile, saveState] = useSaveProfileMutation();

    React.useEffect(() => {
        if (saveState.isSuccess) {
            toast.success(
                t(
                    'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
                )
            );
            saveState.reset();
        }
    }, [saveState, t]);

    const apiState = saveState.isUninitialized
        ? null
        : {
              loading: saveState.isLoading,
              success: false,
              message: saveState.error?.data?.message
          };

    if (!user) {
        return (
            <AlertPanel
                type='danger'
                message={t('You need to be logged in to view your profile')}
            />
        );
    }

    return (
        <div className='w-full lg:mx-auto lg:w-10/12'>
            <ApiStatus state={apiState} onClose={() => saveState.reset()} />
            <Profile
                onSubmit={(profile) => {
                    return saveProfile({ username: user.username, details: profile });
                }}
                isLoading={saveState.isLoading}
            />
        </div>
    );
};

export default ProfileContainer;
