import React, { useRef, useState } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { PatreonStatus } from '../../types';
import Panel from '../Site/Panel';
import Avatar from '../Site/Avatar';
import { PatreonClientId } from '../../constants';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';

import './ProfileMain.scss';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef ProfileMainProps
 * @property {import('formik').FormikProps<ProfileDetails} formProps
 * @property {User} user
 */

/**
 * @param {ProfileMainProps} props
 */
const ProfileMain = ({ user, formProps }) => {
    const { t } = useTranslation();
    const inputFile = useRef(null);
    const [localAvatar, setAvatar] = useState(null);

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
            <Form.Row>
                <Form.Group as={Col} md='6' controlId='formGridEmail'>
                    <Form.Label>{t('Email')}</Form.Label>
                    <Form.Control
                        name='email'
                        type='text'
                        placeholder={t('Enter an email address')}
                        value={formProps.values.email}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        isInvalid={formProps.touched.email && !!formProps.errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.email}
                    </Form.Control.Feedback>
                </Form.Group>{' '}
                <Form.Group as={Col} md='3'>
                    <Form.Label>{t('Avatar')}</Form.Label>
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
                        <Button variant='secondary' onClick={onAvatarUploadClick}>
                            Change avatar
                        </Button>
                    </div>
                    <Form.Control
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
                        isInvalid={!!formProps.errors.avatar}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.avatar}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='3'>
                    <Form.Label>{t('Patreon')}</Form.Label>
                    <div>
                        <img
                            className='profile-patreon-icon'
                            src={PatreonImage}
                            alt={t('Patreon Logo')}
                        />
                        {user?.patreonStatus === PatreonStatus.Unlinked ? (
                            <Button variant='secondary' href={patreonUrl}>
                                Link Account
                            </Button>
                        ) : (
                            <Button variant='secondary'>Unlink Account</Button>
                        )}
                    </div>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md='6' controlId='formGridPassword'>
                    <Form.Label>{t('Password')}</Form.Label>
                    <Form.Control
                        name='password'
                        type='password'
                        placeholder={t('Enter a password')}
                        value={formProps.values.password}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        isInvalid={formProps.touched.password && !!formProps.errors.password}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='6' controlId='formGridPassword1'>
                    <Form.Label>{t('Password (again)')}</Form.Label>
                    <Form.Control
                        name='passwordAgain'
                        type='password'
                        placeholder={t('Enter the same password')}
                        value={formProps.values.passwordAgain}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        isInvalid={
                            formProps.touched.passwordAgain && !!formProps.errors.passwordAgain
                        }
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.passwordAgain}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md='6' controlId='formGridChallongeKey'>
                    <Form.Label>{t('Challonge API Key')}</Form.Label>
                    <Form.Control
                        name='challongeApiKey'
                        type='password'
                        placeholder={t('Enter challonge API key')}
                        value={formProps.values.challongeApiKey}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        isInvalid={
                            formProps.touched.challongeApiKey && !!formProps.errors.challongeApiKey
                        }
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.challongeApiKey}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md='6' controlId='formGridChallongeDomain'>
                    <Form.Label>{t('Challonge API Subdomain')}</Form.Label>
                    <Form.Control
                        name='challongeApiSubdomain'
                        type='password'
                        placeholder={t('Challonge API subdomain')}
                        value={formProps.values.challongeApiSubdomain}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        isInvalid={
                            formProps.touched.challongeApiSubdomain &&
                            !!formProps.errors.challongeApiSubdomain
                        }
                    />
                    <Form.Control.Feedback type='invalid'>
                        {formProps.errors.challongeApiSubdomain}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
        </Panel>
    );
};

export default ProfileMain;
