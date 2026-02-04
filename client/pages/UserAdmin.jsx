import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Table, Button, Spinner, Row } from 'react-bootstrap';
import moment from 'moment';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useFindUserQuery, useSaveUserMutation } from '../redux/api';
import { clearUserSessions } from '../redux/slices/adminSlice';

import './UserAdmin.scss';
import { useState } from 'react';

const defaultPermissions = {
    canEditNews: false,
    canManageUsers: false,
    canManagePermissions: false,
    canManageGames: false,
    canManageNodes: false,
    canModerateChat: false,
    canVerifyDecks: false,
    canManageBanlist: false,
    canManageMotd: false,
    canManageTournaments: false,
    isAdmin: false,
    isContributor: false,
    isSupporter: false,
    isWinner: false,
    isPreviousWinner: false
};

const permissions = [
    { name: 'canEditNews', label: 'News Editor' },
    { name: 'canManageUsers', label: 'User Manager' },
    { name: 'canManagePermissions', label: 'Permissions Manager' },
    { name: 'canManageGames', label: 'Games Manager' },
    { name: 'canManageNodes', label: 'Node Manager' },
    { name: 'canModerateChat', label: 'Chat Moderator' },
    { name: 'canVerifyDecks', label: 'Deck Verifier' },
    { name: 'canManageBanlist', label: 'Banlist Manager' },
    { name: 'canManageMotd', label: 'Motd Manager' },
    { name: 'canManageTournaments', label: 'Tournaments Manager' },
    { name: 'isAdmin', label: 'Site Admin' },
    { name: 'isContributor', label: 'Contributor' },
    { name: 'isSupporter', label: 'Supporter' },
    { name: 'isWinner', label: 'Tournament Winner' },
    { name: 'isPreviousWinner', label: 'Previous Tournament Winner' },
    {
        name: 'keepsSupporterWithNoPatreon',
        label: "Don't remove supporter when patreon expires/unlinks"
    }
];

const UserAdmin = () => {
    const currentUser = useSelector((state) => state.admin.currentUser);
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const [searchUsername, setSearchUsername] = useState('');
    const findUserState = useFindUserQuery(searchUsername, {
        skip: !searchUsername
    });
    const [saveUser, saveState] = useSaveUserMutation();
    const apiState = findUserState.isUninitialized
        ? null
        : {
              loading: findUserState.isFetching,
              success: findUserState.isSuccess,
              message: findUserState.isError
                  ? findUserState.error?.status === 404
                      ? 'User was not found.'
                      : findUserState.error?.data?.message
                  : 'User details loaded'
          };
    const apiSaveState = saveState.isUninitialized
        ? null
        : {
              loading: saveState.isLoading,
              success: saveState.isSuccess,
              message: saveState.isSuccess ? 'User details saved.' : saveState.error?.data?.message
          };
    const dispatch = useDispatch();
    const [currentPermissions, setCurrentPermissions] = useState(
        currentUser?.permissions || defaultPermissions
    );
    const [userVerified, setUserVerified] = useState(currentUser?.verified);
    const [userDisabled, setUserDisabled] = useState(currentUser?.disabled);

    useEffect(() => {
        if (currentUser) {
            setCurrentPermissions(currentUser.permissions);
            setUserDisabled(currentUser.disabled);
            setUserVerified(currentUser.verified);
        }
    }, [currentUser]);

    const initialValues = {
        username: '',
        disabled: currentUser?.disabled,
        verified: currentUser?.verified
    };

    const schema = yup.object({
        username: yup.string().required('Username must be specified')
    });

    let permissionsCheckBoxes;

    if (currentUser) {
        permissionsCheckBoxes = permissions.map((permission) => {
            return (
                <Col key={`permissions.${permission.name}`} md='4'>
                    <Form.Check
                        type='switch'
                        id={`permissions.${permission.name}`}
                        label={permission.label}
                        inline
                        onChange={() => {
                            currentPermissions[permission.name] =
                                !currentPermissions[permission.name];
                            let newPermissions = Object.assign({}, currentPermissions);
                            setCurrentPermissions(newPermissions);
                        }}
                        value='true'
                        checked={currentPermissions[permission.name]}
                    ></Form.Check>
                </Col>
            );
        });
    }

    return (
        <Col sm={{ span: 8, offset: 2 }}>
            <ApiStatus state={apiState} onClose={() => setSearchUsername('')} />
            <ApiStatus state={apiSaveState} onClose={() => saveState.reset()} />
            <Formik
                validationSchema={schema}
                onSubmit={async (values) => {
                    setSearchUsername(values.username);
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();
                            formProps.handleSubmit(event);
                        }}
                    >
                        <Panel title='User administration'>
                            <Row>
                                <Form.Group as={Col} md='6' controlId='formUsername'>
                                    <Form.Label>{t('Username')}</Form.Label>
                                    <Form.Control
                                        name='username'
                                        type='text'
                                        placeholder={t('Enter a username')}
                                        value={formProps.values.username}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.username &&
                                            !!formProps.errors.username
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Button type='submit' variant='primary'>
                                        Submit&nbsp;
                                        {apiState?.loading && (
                                            <Spinner
                                                animation='border'
                                                size='sm'
                                                as={'span'}
                                                role='status'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Panel>
                        {currentUser && (
                            <div>
                                <Panel title={`${currentUser.username} - User details`}>
                                    <dl>
                                        <Row>
                                            <Col md={3}>
                                                <dt>Username:</dt>
                                            </Col>
                                            <Col md={3}>
                                                <dd>{currentUser.username}</dd>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <dt>Email:</dt>
                                            </Col>
                                            <Col md={3}>
                                                <dd>{currentUser.email}</dd>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <dt>Registered:</dt>
                                            </Col>
                                            <Col md={3}>
                                                <dd>
                                                    {moment(currentUser.registered).format(
                                                        'YYYY-MM-DD HH:MM'
                                                    )}
                                                </dd>
                                            </Col>
                                        </Row>
                                    </dl>

                                    <Form.Check
                                        type='switch'
                                        id='disabled'
                                        label={'Disabled'}
                                        inline
                                        onChange={() => setUserDisabled(!userDisabled)}
                                        value='true'
                                        checked={userDisabled}
                                    ></Form.Check>
                                    <Form.Check
                                        type='switch'
                                        id='verified'
                                        label={'Verified'}
                                        inline
                                        onChange={() => setUserVerified(!userVerified)}
                                        value='true'
                                        checked={userVerified}
                                    ></Form.Check>
                                </Panel>
                                {currentUser.linkedAccounts && (
                                    <Panel title='Possibly linked accounts'>
                                        <ul className='list'>
                                            {currentUser.linkedAccounts.map((name) => {
                                                return (
                                                    <li key={name}>
                                                        <a
                                                            href='javascript:void(0)'
                                                            onClick={() => setSearchUsername(name)}
                                                        >
                                                            {name}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Panel>
                                )}
                                {currentUser.tokens && (
                                    <Panel title='Sessions'>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>IP Address</th>
                                                    <th>Last Used</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentUser.tokens.map((token) => {
                                                    return (
                                                        <tr key={token.ip}>
                                                            <td>{token.ip}</td>
                                                            <td>
                                                                {moment(token.lastUsed).format(
                                                                    'YYYY-MM-DD HH:MM'
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Panel>
                                )}
                                {user?.permissions.canManagePermissions ? (
                                    <Panel title='Permissions'>
                                        <Form.Group>
                                            <Row>{permissionsCheckBoxes}</Row>
                                        </Form.Group>
                                    </Panel>
                                ) : null}
                                <div className='text-center'>
                                    <Button
                                        type='button'
                                        className='btn btn-primary col-xs-3'
                                        onClick={() =>
                                            dispatch(clearUserSessions(currentUser.username))
                                        }
                                    >
                                        Clear sessions
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='primary'
                                        onClick={() => {
                                            currentUser.permissions = currentPermissions;
                                            currentUser.verified = userVerified;
                                            currentUser.disabled = userDisabled;

                                            saveUser(currentUser);
                                        }}
                                    >
                                        Save&nbsp;
                                        {apiSaveState?.loading && (
                                            <Spinner
                                                animation='border'
                                                size='sm'
                                                as={'span'}
                                                role='status'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </Col>
    );
};

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
