import React, { useRef, useState } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { PatreonStatus } from '../../types';
import Panel from '../Site/Panel';
import Avatar from '../Site/Avatar';
import { PatreonClientId, AuthServerUrl } from '../../constants';
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
 * @returns {React.FC<ProfileMainProps>}
 */
const ProfileMain = (props) => {
    const { t } = useTranslation();
    const inputFile = useRef(null);
    const [localAvatar, setAvatar] = useState(null);
    const formProps = props.formProps;
    const { user } = props;

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
                <Form.Group as={Col} md='6'>
                    <Form.Label>Email</Form.Label>
                    <div>{user ? user.email : ''}</div>
                </Form.Group>
                <Col md={6}>
                    Account details need to be updated on the{' '}
                    <a href={AuthServerUrl}>Gameteki site</a>.
                </Col>
            </Form.Row>
            <Form.Row>
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
                            <Avatar username={user?.username}></Avatar>
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
        </Panel>
    );
};

export default ProfileMain;
