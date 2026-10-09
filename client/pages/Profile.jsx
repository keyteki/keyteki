import React from 'react';
import { toast } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Profile from '../Components/Profile/Profile';
import { useSaveProfileMutation } from '../redux/api';
import { setAuthTokens } from '../redux/slices/authSlice';
import ApiStatus from '../Components/Site/ApiStatus';
import AlertPanel from '../Components/Site/AlertPanel';

const ProfileContainer = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
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
                onSubmit={async (profile) => {
                    const result = await saveProfile({ username: user.username, details: profile });

                    // Changing password or username replaces every session, including this one
                    if (result.data?.token && result.data?.refreshToken) {
                        dispatch(
                            setAuthTokens({
                                token: result.data.token,
                                refreshToken: result.data.refreshToken,
                                user: result.data.user
                            })
                        );
                    }

                    return result;
                }}
                isLoading={saveState.isLoading}
            />
        </div>
    );
};

export default ProfileContainer;
