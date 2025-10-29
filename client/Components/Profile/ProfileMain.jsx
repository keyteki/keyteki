import React, { useRef, useState } from 'react';
import Button from '../HeroUI/Button';
import { Input } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { PatreonStatus } from '../../types';
import Panel from '../Site/Panel';
import Avatar from '../Site/Avatar';
import { PatreonClientId } from '../../constants';
import { unlinkPatreon } from '../../redux/actions';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';

import './ProfileMain.scss';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef ProfileMainProps
 * @property {import('formik').FormikProps<ProfileDetails>} formProps
 * @property {User} user
 */

/**
 * @param {ProfileMainProps} props
 */
const ProfileMain = ({ user, formProps }) => {
    const { t } = useTranslation();
    const inputFile = useRef(null);
    const [localAvatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    const onAvatarUploadClick = () => {
        if (!inputFile.current) {
            return;
        }

        inputFile.current.click();
    };

    const callbackUrl = `${window.location.origin}/patreon`;
    const patreonUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PatreonClientId}&redirect_uri=${callbackUrl}`;

    return (
        <Panel title={t('Profile')}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    label={t('Username')}
                    name='username'
                    type='text'
                    placeholder={t('Enter a username')}
                    value={formProps.values.username}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={formProps.touched.username && !!formProps.errors.username}
                    errorMessage={formProps.errors.username}
                />
                <Input
                    label={t('Email')}
                    name='email'
                    type='text'
                    placeholder={t('Enter an email address')}
                    value={formProps.values.email}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={formProps.touched.email && !!formProps.errors.email}
                    errorMessage={formProps.errors.email}
                />
                <div className='md:col-span-1'>
                    <label className='block text-sm mb-1'>{t('Avatar')}</label>
                    <div>
                        {!formProps.errors.avatar && localAvatar ? (
                            <img
                                className='profile-avatar'
                                src={localAvatar}
                                alt={user?.username}
                            />
                        ) : (
                            <Avatar imgPath={user?.avatar}></Avatar>
                        )}
                        <Button color='secondary' onPress={onAvatarUploadClick}>
                            {t('Change avatar')}
                        </Button>
                    </div>
                    <input
                        name='avatar'
                        type='file'
                        accept='image/*'
                        onChange={(event) => {
                            if (
                                !event.currentTarget ||
                                !event.currentTarget.files ||
                                event.currentTarget.files.length === 0
                            ) {
                                return;
                            }

                            const file = event.currentTarget.files[0];
                            setAvatar(URL.createObjectURL(file));
                            formProps.setFieldValue('avatar', file);
                        }}
                        onBlur={formProps.handleBlur}
                        hidden
                        ref={inputFile}
                    />
                    {formProps.errors.avatar && (
                        <span className='text-danger text-xs'>{formProps.errors.avatar}</span>
                    )}
                </div>
                <div className='md:col-span-1'>
                    <label className='block text-sm mb-1'>{t('Patreon')}</label>
                    <div>
                        <img
                            className='profile-patreon-icon'
                            src={PatreonImage}
                            alt={t('Patreon Logo')}
                        />
                        {!user?.patreon || user?.patreon === PatreonStatus.Unlinked ? (
                            <Button color='secondary' href={patreonUrl}>
                                {t('Link Account')}
                            </Button>
                        ) : (
                            <Button color='secondary' onPress={() => dispatch(unlinkPatreon())}>
                                {t('Unlink Account')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <Input
                    label={t('Password')}
                    name='password'
                    type='password'
                    placeholder={t('Enter a password')}
                    value={formProps.values.password}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={formProps.touched.password && !!formProps.errors.password}
                    errorMessage={formProps.errors.password}
                />
                <Input
                    label={t('Password (again)')}
                    name='passwordAgain'
                    type='password'
                    placeholder={t('Enter the same password')}
                    value={formProps.values.passwordAgain}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={formProps.touched.passwordAgain && !!formProps.errors.passwordAgain}
                    errorMessage={formProps.errors.passwordAgain}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <Input
                    label={t('Challonge API Key')}
                    name='challongeApiKey'
                    type='password'
                    placeholder={t('Enter challonge API key')}
                    value={formProps.values.challongeApiKey}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={
                        formProps.touched.challongeApiKey && !!formProps.errors.challongeApiKey
                    }
                    errorMessage={formProps.errors.challongeApiKey}
                />
                <Input
                    label={t('Challonge API Subdomain')}
                    name='challongeApiSubdomain'
                    type='password'
                    placeholder={t('Enter challonge API subdomain')}
                    value={formProps.values.challongeApiSubdomain}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={
                        formProps.touched.challongeApiSubdomain &&
                        !!formProps.errors.challongeApiSubdomain
                    }
                    errorMessage={formProps.errors.challongeApiSubdomain}
                />
            </div>
        </Panel>
    );
};

export default ProfileMain;
