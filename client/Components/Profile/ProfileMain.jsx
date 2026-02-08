import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import { PatreonClientId } from '../../constants';
import PatreonImage from '../../assets/img/Patreon_Mark_Coral.jpg';
import { useDeleteAccountMutation, useUnlinkPatreonMutation } from '../../redux/api';
import { PatreonStatus } from '../../types';
import Avatar from '../Site/Avatar';
import Panel from '../Site/Panel';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

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
    const [unlinkPatreon] = useUnlinkPatreonMutation();
    const [deleteAccount, deleteState] = useDeleteAccountMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onAvatarUploadClick = () => {
        if (!inputFile.current) {
            return;
        }

        inputFile.current.click();
    };

    const callbackUrl = `${window.location.origin}/patreon`;
    const patreonUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PatreonClientId}&redirect_uri=${callbackUrl}`;

    return (
        <>
            <Panel title={t('Profile')}>
                <Row>
                    <Form.Group as={Col} md='6' controlId='formGridUsername'>
                        <Form.Label>{t('Username')}</Form.Label>
                        <Form.Control
                            name='username'
                            type='text'
                            placeholder={t('Enter a username')}
                            value={formProps.values.username}
                            onChange={formProps.handleChange}
                            onBlur={formProps.handleBlur}
                            isInvalid={formProps.touched.username && !!formProps.errors.username}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formProps.errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>
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
                    </Form.Group>
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
                                {t('Change avatar')}
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
                            {!user?.patreon || user?.patreon === PatreonStatus.Unlinked ? (
                                <Button variant='secondary' href={patreonUrl}>
                                    {t('Link Account')}
                                </Button>
                            ) : (
                                <Button variant='secondary' onClick={() => unlinkPatreon()}>
                                    {t('Unlink Account')}
                                </Button>
                            )}
                        </div>
                    </Form.Group>
                </Row>
                <Row>
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
                </Row>
                <Row>
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
                                formProps.touched.challongeApiKey &&
                                !!formProps.errors.challongeApiKey
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
                            placeholder={t('Enter challonge API subdomain')}
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
                </Row>
            </Panel>
            <Panel title={t('Delete Account')}>
                <Row>
                    <Col md='8'>
                        {t(
                            'Deleting your account will anonymize your profile and remove your avatar. This action cannot be undone.'
                        )}
                    </Col>
                    <Col md='4' className='text-right'>
                        <Button variant='danger' onClick={() => setShowDeleteModal(true)}>
                            {t('Delete account')}
                        </Button>
                    </Col>
                </Row>
            </Panel>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Confirm account deletion')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId='deleteAccountPassword'>
                        <Form.Label className='delete-account-label'>{t('Password')}</Form.Label>
                        <Form.Control
                            type='password'
                            value={deletePassword}
                            onChange={(event) => setDeletePassword(event.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        variant='danger'
                        disabled={deleteState.isLoading || !deletePassword}
                        onClick={async () => {
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
                                toast.error(err?.data?.message || t('Failed to delete account.'));
                            }
                        }}
                    >
                        {deleteState.isLoading ? t('Deleting...') : t('Delete account')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileMain;
