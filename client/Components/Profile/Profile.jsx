import React, { useState } from 'react';
import { Button as HeroButton, Spinner as HeroSpinner } from '@heroui/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import ProfileMain from './ProfileMain';
import ProfileBackground from './ProfileBackground';
import KeyforgeGameSettings from './KeyforgeGameSettings';
import ProfileCardSize from './ProfileCardSize';
import { Constants } from '../../constants';
import { toBase64 } from '../../util.jsx';
import BlankBg from '../../assets/img/bgs/blank.png';
import MassMutationBg from '../../assets/img/bgs/massmutation.png';
import AlertPanel from '../Site/AlertPanel';

/**
 * User profile settings
 * @typedef {Object} SettingsDetails
 * @property {string} background The game board background
 * @property {string} cardSize The size of the cards to display
 */

/**
 * User profile
 * @typedef {Object} ProfileDetails
 * @property {string} username The user new username
 * @property {string} email The user email address
 * @property {SettingsDetails} settings The user profile settings
 */

/**
 * The user's in game options
 * @typedef {Object} GameOptionsDetails
 * @property {boolean} orderForcedAbilities Whether or not to order forced abilities
 * @property {boolean} confirmOneClick Force a prompt for one click abilities
 * @property {boolean} useHalfSizedCards Use halfSize card images
 */

/**
 * Existing Profile Details
 * @typedef {Object} ExistingProfileDetails
 * @property {string} username
 * @property {string} email The user email address
 * @property {SettingsDetails} settings The user profile settings
 * @property {GameOptionsDetails} gameOptions The user email address
 * @property {File} avatar The avatar
 */

/**
 * @typedef {Object} ProfileProps
 * @property {function(ProfileDetails): void} onSubmit The onSubmit callback
 * @property {User} user The user object
 * @property {boolean} isLoading Wheter or not the profile is loading from the server
 */

/**
 * @type {ExistingProfileDetails}
 */
const initialValues = {
    avatar: undefined,
    email: '',
    username: '',
    challongeApiKey: '',
    challongeApiSubdomain: '',
    settings: {
        background: '',
        cardSize: ''
    },
    gameOptions: {
        confirmOneClick: false,
        orderForcedAbilities: false,
        useHalfSizedCards: false,
        showAccolades: true
    }
};

const ProfileSection = Object.freeze({
    Account: 'account',
    Integrations: 'integrations',
    Appearance: 'appearance',
    Gameplay: 'gameplay'
});

/**
 * @param {ProfileProps} props
 */
const Profile = ({ onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const [localBackground, setBackground] = useState(user?.settings.background);
    const [localCardSize, setCardSize] = useState(user?.settings.cardSize);
    const [customBg, setCustomBg] = useState(null);
    const [activeSection, setActiveSection] = useState(ProfileSection.Account);

    const backgrounds = [{ name: 'none', label: t('none'), imageUrl: BlankBg }];
    const cardSizes = [
        { name: 'small', label: t('small') },
        { name: 'normal', label: t('normal') },
        { name: 'large', label: t('large') },
        { name: 'x-large', label: t('extra-large') }
    ];

    for (let i = 0; i < Constants.Houses.length; ++i) {
        const label = t(Constants.Houses[i]);
        backgrounds.push({
            name: Constants.HousesNames[i],
            label: label[0].toUpperCase() + label.slice(1),
            imageUrl: Constants.HouseBgPaths[Constants.Houses[i]]
        });
    }

    backgrounds.push({
        name: 'massmutation',
        label: t('Mass Mutation'),
        imageUrl: MassMutationBg
    });

    if (!user) {
        return (
            <AlertPanel
                type='danger'
                message={t('You need to be logged in to view your profile')}
            />
        );
    }

    initialValues.email = user.email;
    initialValues.username = user.username;
    if (user?.settings?.optionSettings) {
        initialValues.gameOptions = user.settings.optionSettings;
    }

    if (user.challonge) {
        initialValues.challongeApiKey = user.challonge.key;
        initialValues.challongeApiSubdomain = user.challonge.subdomain;
    }

    const schema = yup.object({
        avatar: yup
            .mixed()
            .test(
                'fileSize',
                t('Image must be less than 100KB in size'),
                (value) => !value || value.size <= 100 * 1024
            )
            .test(
                'fileType',
                t('Unsupported image format'),
                (value) =>
                    !value ||
                    ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type)
            ),
        username: yup
            .string()
            .required(t('You must specify a username'))
            .min(3, t('Your username must be at least 3 characters long'))
            .max(15, t('Your username cannot be more than 15 charcters'))
            .matches(
                /^[A-Za-z0-9_-]+$/,
                t('Usernames must only use the characters a-z, 0-9, _ and -')
            ),
        email: yup
            .string()
            .email(t('Please enter a valid email address'))
            .required(t('You must specify an email address')),
        password: yup.string().min(6, t('Password must be at least 6 characters')),
        passwordAgain: yup
            .string()
            .oneOf([yup.ref('password'), null], t('The passwords you have entered do not match'))
    });

    return (
        <Formik
            validationSchema={schema}
            onSubmit={async (values) => {
                /**
                 * @type {ProfileDetails}
                 */
                const submitValues = {
                    avatar: values.avatar ? await toBase64(values.avatar) : null,
                    challonge: {
                        key: values.challongeApiKey,
                        subdomain: values.challongeApiSubdomain
                    },
                    email: values.email,
                    username: values.username,
                    password: values.password,
                    settings: { optionSettings: values.gameOptions }
                };

                if (localBackground) {
                    submitValues.settings.background = localBackground;
                }

                if (localCardSize) {
                    submitValues.settings.cardSize = localCardSize;
                }

                if (customBg) {
                    submitValues.customBackground = customBg;
                }

                onSubmit(submitValues);
            }}
            initialValues={initialValues}
        >
            {(formProps) => {
                const hasAppearanceChanges =
                    (localBackground || '') !== (user?.settings?.background || '') ||
                    (localCardSize || '') !== (user?.settings?.cardSize || '') ||
                    !!customBg;
                const hasPendingChanges = formProps.dirty || hasAppearanceChanges;

                return (
                    <form
                        className='profile-form'
                        onSubmit={(event) => {
                            event.preventDefault();
                            formProps.handleSubmit(event);
                        }}
                    >
                        <div className='grid gap-3 lg:grid-cols-[200px_minmax(0,1fr)]'>
                            <aside className='rounded-md bg-surface/85 p-2 text-foreground backdrop-blur-sm lg:sticky lg:top-2 lg:h-fit'>
                                <div className='mb-2 text-xs uppercase tracking-wide text-muted'>
                                    {t('Settings')}
                                </div>
                                <nav className='grid gap-1'>
                                    {[
                                        [ProfileSection.Account, t('Account')],
                                        [ProfileSection.Integrations, t('Integrations')],
                                        [ProfileSection.Appearance, t('Appearance')],
                                        [ProfileSection.Gameplay, t('Gameplay')]
                                    ].map(([sectionKey, label]) => (
                                        <HeroButton
                                            key={sectionKey}
                                            className='w-full justify-start text-sm'
                                            size='sm'
                                            variant={
                                                activeSection === sectionKey
                                                    ? 'primary'
                                                    : 'secondary'
                                            }
                                            onClick={() => setActiveSection(sectionKey)}
                                        >
                                            {label}
                                        </HeroButton>
                                    ))}
                                </nav>
                            </aside>
                            <section className='flex min-h-0 flex-col overflow-hidden rounded-md bg-surface/85 text-foreground backdrop-blur-sm'>
                                <header className='border-b border-border/70 px-3 py-2'>
                                    <h2 className='m-0 text-base text-foreground'>
                                        {activeSection === ProfileSection.Account
                                            ? t('Account')
                                            : activeSection === ProfileSection.Integrations
                                            ? t('Integrations')
                                            : activeSection === ProfileSection.Appearance
                                            ? t('Appearance')
                                            : activeSection === ProfileSection.Gameplay
                                            ? t('Gameplay')
                                            : t('Settings')}
                                    </h2>
                                </header>
                                <div className='min-h-0 flex-1 overflow-y-auto px-3 py-3'>
                                    <div className='w-full'>
                                        {(activeSection === ProfileSection.Account ||
                                            activeSection === ProfileSection.Integrations) && (
                                            <ProfileMain
                                                formProps={formProps}
                                                user={user}
                                                section={activeSection}
                                            />
                                        )}
                                        {activeSection === ProfileSection.Appearance && (
                                            <div className='space-y-3'>
                                                <ProfileBackground
                                                    backgrounds={backgrounds}
                                                    selectedBackground={
                                                        localBackground || user.settings.background
                                                    }
                                                    customBackground={
                                                        user.settings.customBackground
                                                    }
                                                    onBackgroundSelected={async (name, file) => {
                                                        if (name === 'custom') {
                                                            const base64File = await toBase64(file);
                                                            setCustomBg(base64File);
                                                        }

                                                        setBackground(name);
                                                    }}
                                                />
                                                <ProfileCardSize
                                                    cardSizes={cardSizes}
                                                    selectedCardSize={
                                                        localCardSize || user.settings.cardSize
                                                    }
                                                    onCardSizeSelected={(name) => setCardSize(name)}
                                                />
                                            </div>
                                        )}
                                        {activeSection === ProfileSection.Gameplay && (
                                            <KeyforgeGameSettings
                                                formProps={formProps}
                                                user={user}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className='sticky bottom-0 border-t border-border/70 bg-overlay/85 px-3 py-2'>
                                    <div className='flex items-center justify-between gap-3'>
                                        <div className='text-xs text-muted'>
                                            {hasPendingChanges
                                                ? t('You have unsaved changes')
                                                : t('No pending changes')}
                                        </div>
                                        <HeroButton
                                            variant='primary'
                                            type='submit'
                                            isDisabled={!hasPendingChanges || isLoading}
                                        >
                                            {isLoading ? (
                                                <HeroSpinner
                                                    size='sm'
                                                    className='mr-2 align-middle'
                                                />
                                            ) : null}
                                            {t('Save')}
                                        </HeroButton>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default Profile;
