import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button as HeroButton,
    FieldError,
    Input,
    Label,
    Modal as HeroModal,
    TextField
} from '@heroui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from '@heroui/react';

import { PatreonClientId } from '../../constants';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';
import { useDeleteAccountMutation, useUnlinkPatreonMutation } from '../../redux/api';
import { authActions } from '../../redux/slices/authSlice';
import { PatreonStatus } from '../../types';
import Avatar from '../Site/Avatar';
import Panel from '../Site/Panel';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */
/**
 * @typedef {'account' | 'integrations'} ProfileMainSection
 */
/**
 * @typedef ProfileMainProps
 * @property {import('formik').FormikProps<ProfileDetails>} formProps
 * @property {ProfileMainSection} section
 * @property {User} user
 */
/**
 * @param {ProfileMainProps} props
 */
const ProfileMain = ({ user, formProps, section }) => {
    const { t } = useTranslation();
    const inputFile = useRef(null);
    const [localAvatar, setAvatar] = useState(null);
    const [unlinkPatreon] = useUnlinkPatreonMutation();
    const [deleteAccount, deleteState] = useDeleteAccountMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const callbackUrl = `${window.location.origin}/patreon`;
    const patreonUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PatreonClientId}&redirect_uri=${callbackUrl}`;

    if (section === 'account') {
        return (
            <div className='space-y-3'>
                <Panel type='default' compactHeader title={t('Credentials')}>
                    <div className='grid gap-2 md:grid-cols-2'>
                        <TextField
                            isInvalid={formProps.touched.username && !!formProps.errors.username}
                        >
                            <Label htmlFor='formGridUsername'>{t('Username')}</Label>
                            <Input
                                id='formGridUsername'
                                name='username'
                                placeholder={t('Enter a username')}
                                value={formProps.values.username}
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                            />
                            {formProps.touched.username && !!formProps.errors.username && (
                                <FieldError>{formProps.errors.username}</FieldError>
                            )}
                        </TextField>
                        <TextField isInvalid={formProps.touched.email && !!formProps.errors.email}>
                            <Label htmlFor='formGridEmail'>{t('Email')}</Label>
                            <Input
                                id='formGridEmail'
                                name='email'
                                placeholder={t('Enter an email address')}
                                value={formProps.values.email}
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                            />
                            {formProps.touched.email && !!formProps.errors.email && (
                                <FieldError>{formProps.errors.email}</FieldError>
                            )}
                        </TextField>
                        <TextField
                            isInvalid={formProps.touched.password && !!formProps.errors.password}
                        >
                            <Label htmlFor='formGridPassword'>{t('Password')}</Label>
                            <Input
                                id='formGridPassword'
                                name='password'
                                type='password'
                                placeholder={t('Enter a password')}
                                value={formProps.values.password}
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                            />
                            {formProps.touched.password && !!formProps.errors.password && (
                                <FieldError>{formProps.errors.password}</FieldError>
                            )}
                        </TextField>
                        <TextField
                            isInvalid={
                                formProps.touched.passwordAgain && !!formProps.errors.passwordAgain
                            }
                        >
                            <Label htmlFor='formGridPassword1'>{t('Password (again)')}</Label>
                            <Input
                                id='formGridPassword1'
                                name='passwordAgain'
                                type='password'
                                placeholder={t('Enter the same password')}
                                value={formProps.values.passwordAgain}
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                            />
                            {formProps.touched.passwordAgain &&
                                !!formProps.errors.passwordAgain && (
                                    <FieldError>{formProps.errors.passwordAgain}</FieldError>
                                )}
                        </TextField>
                    </div>
                </Panel>
                <Panel type='default' compactHeader title={t('Avatar')}>
                    <div className='flex items-center gap-3'>
                        {!formProps.errors.avatar && localAvatar ? (
                            <img className='h-8 w-8' src={localAvatar} alt={user?.username} />
                        ) : (
                            <Avatar imgPath={user?.avatar} />
                        )}
                        <HeroButton variant='tertiary' onPress={() => inputFile.current?.click()}>
                            {t('Change avatar')}
                        </HeroButton>
                    </div>
                    <input
                        accept='image/*'
                        hidden
                        name='avatar'
                        ref={inputFile}
                        type='file'
                        onBlur={formProps.handleBlur}
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
                    />
                    {!!formProps.errors.avatar && (
                        <p className='mt-2 text-sm text-red-400'>{formProps.errors.avatar}</p>
                    )}
                </Panel>
                <Panel
                    type='default'
                    compactHeader
                    title={t('Delete Account')}
                    className='border border-danger/70 bg-danger/15'
                    titleClass='text-red-300'
                >
                    <div className='grid items-center gap-3 md:grid-cols-[1fr_auto]'>
                        <div className='text-sm text-foreground'>
                            {t('Deletes profile identity and avatar permanently.')}
                        </div>
                        <HeroButton variant='danger' onPress={() => setShowDeleteModal(true)}>
                            {t('Delete account')}
                        </HeroButton>
                    </div>
                </Panel>
                <HeroModal.Backdrop isOpen={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <HeroModal.Container placement='center'>
                        <HeroModal.Dialog className='sm:max-w-md'>
                            <HeroModal.CloseTrigger />
                            <HeroModal.Header>
                                <HeroModal.Heading>
                                    {t('Confirm account deletion')}
                                </HeroModal.Heading>
                            </HeroModal.Header>
                            <HeroModal.Body>
                                <TextField name='deleteAccountPassword' type='password'>
                                    <Label>{t('Password')}</Label>
                                    <Input
                                        autoFocus
                                        value={deletePassword}
                                        onChange={(event) => setDeletePassword(event.target.value)}
                                    />
                                </TextField>
                            </HeroModal.Body>
                            <HeroModal.Footer>
                                <HeroButton
                                    variant='tertiary'
                                    onPress={() => setShowDeleteModal(false)}
                                >
                                    {t('Cancel')}
                                </HeroButton>
                                <HeroButton
                                    variant='danger'
                                    isDisabled={deleteState.isLoading || !deletePassword}
                                    onPress={async () => {
                                        try {
                                            await deleteAccount({
                                                username: user.username,
                                                password: deletePassword
                                            }).unwrap();
                                            dispatch(authActions.clearAuthTokens());
                                            setShowDeleteModal(false);
                                            setDeletePassword('');
                                            toast.success(t('Your account has been deleted.'));
                                            navigate('/login');
                                        } catch (err) {
                                            toast.danger(
                                                err?.data?.message || t('Failed to delete account.')
                                            );
                                        }
                                    }}
                                >
                                    {deleteState.isLoading ? t('Deleting...') : t('Delete account')}
                                </HeroButton>
                            </HeroModal.Footer>
                        </HeroModal.Dialog>
                    </HeroModal.Container>
                </HeroModal.Backdrop>
            </div>
        );
    }

    return (
        <div className='space-y-3'>
            <Panel type='default' compactHeader title={t('Connected Services')}>
                <div className='flex items-center justify-between gap-3 rounded border border-border/70 bg-surface-secondary/75 px-3 py-2'>
                    <div className='flex items-center gap-3'>
                        <img className='h-5' src={PatreonImage} alt={t('Patreon Logo')} />
                        <div>
                            <div className='text-sm text-foreground'>Patreon</div>
                            <div className='text-xs text-muted'>
                                {!user?.patreon || user?.patreon === PatreonStatus.Unlinked
                                    ? t('Not connected')
                                    : t('Connected')}
                            </div>
                        </div>
                    </div>
                    {!user?.patreon || user?.patreon === PatreonStatus.Unlinked ? (
                        <HeroButton
                            size='sm'
                            variant='tertiary'
                            onPress={() => window.location.assign(patreonUrl)}
                        >
                            {t('Link Account')}
                        </HeroButton>
                    ) : (
                        <HeroButton size='sm' variant='tertiary' onPress={() => unlinkPatreon()}>
                            {t('Unlink Account')}
                        </HeroButton>
                    )}
                </div>
            </Panel>
            <Panel
                type='default'
                compactHeader
                title={t('API Keys')}
                className='border border-warning/70 bg-warning/10'
                titleClass='text-amber-300'
            >
                <div className='grid gap-3 md:grid-cols-2'>
                    <TextField>
                        <Label htmlFor='formGridChallongeKey'>{t('Challonge API Key')}</Label>
                        <Input
                            id='formGridChallongeKey'
                            name='challongeApiKey'
                            type='password'
                            placeholder={t('Enter challonge API key')}
                            value={formProps.values.challongeApiKey}
                            onBlur={formProps.handleBlur}
                            onChange={formProps.handleChange}
                        />
                    </TextField>
                    <TextField>
                        <Label htmlFor='formGridChallongeDomain'>
                            {t('Challonge API Subdomain')}
                        </Label>
                        <Input
                            id='formGridChallongeDomain'
                            name='challongeApiSubdomain'
                            type='password'
                            placeholder={t('Enter challonge API subdomain')}
                            value={formProps.values.challongeApiSubdomain}
                            onBlur={formProps.handleBlur}
                            onChange={formProps.handleChange}
                        />
                    </TextField>
                </div>
            </Panel>
        </div>
    );
};

export default ProfileMain;
