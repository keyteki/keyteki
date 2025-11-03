import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/HeroUI/Button';
import { Input, Switch, Spinner } from '@heroui/react';
import moment from 'moment';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import AlertPanel from '../Components/Site/AlertPanel';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useFindUserMutation, useSaveUserMutation } from '../redux/slices/apiSlice';
import { clearUserSessions } from '../redux/actions/admin';

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
    const dispatch = useDispatch();
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const [
        findUser,
        { data: currentUser, isLoading: isFinding, error: findError, isSuccess: findSuccess }
    ] = useFindUserMutation();
    const [saveUser, { isLoading: isSaving, isSuccess: saveSuccess }] = useSaveUserMutation();

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
                <div key={`permissions.${permission.name}`} className='mb-3'>
                    <Switch
                        isSelected={currentPermissions[permission.name]}
                        onValueChange={() => {
                            currentPermissions[permission.name] = !currentPermissions[
                                permission.name
                            ];
                            let newPermissions = Object.assign({}, currentPermissions);
                            setCurrentPermissions(newPermissions);
                        }}
                    >
                        {permission.label}
                    </Switch>
                </div>
            );
        });
    }

    return (
        <div className='max-w-4xl mx-auto'>
            {findError && findError.status === 404 && (
                <AlertPanel type='danger' title='' message='User was not found.'>
                    {null}
                </AlertPanel>
            )}
            {findSuccess && (
                <AlertPanel type='success' title='' message='User details loaded'>
                    {null}
                </AlertPanel>
            )}
            {saveSuccess && (
                <AlertPanel type='success' title='' message='User details saved.'>
                    {null}
                </AlertPanel>
            )}
            <Formik
                validationSchema={schema}
                onSubmit={async (values) => {
                    try {
                        await findUser({ username: values.username }).unwrap();
                    } catch (err) {
                        // Error handled by AlertPanel
                    }
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            formProps.handleSubmit(event);
                        }}
                    >
                        <Panel title='User administration'>
                            <div className='mb-4 max-w-md'>
                                <Input
                                    name='username'
                                    type='text'
                                    label={t('Username')}
                                    placeholder={t('Enter a username')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    isInvalid={
                                        formProps.touched.username && !!formProps.errors.username
                                    }
                                    errorMessage={formProps.errors.username}
                                />
                            </div>
                            <div>
                                <Button type='submit' color='primary'>
                                    Submit&nbsp;
                                    {isFinding && <Spinner size='sm' color='current' />}
                                </Button>
                            </div>
                        </Panel>
                        {currentUser && (
                            <div>
                                <Panel title={`${currentUser.username} - User details`}>
                                    <dl className='grid grid-cols-2 gap-y-2 max-w-2xl'>
                                        <dt className='font-semibold'>Username:</dt>
                                        <dd>{currentUser.username}</dd>
                                        <dt className='font-semibold'>Email:</dt>
                                        <dd>{currentUser.email}</dd>
                                        <dt className='font-semibold'>Registered:</dt>
                                        <dd>
                                            {moment(currentUser.registered).format(
                                                'YYYY-MM-DD HH:MM'
                                            )}
                                        </dd>
                                    </dl>

                                    <div className='mt-4 space-y-3'>
                                        <Switch
                                            isSelected={userDisabled}
                                            onValueChange={setUserDisabled}
                                        >
                                            Disabled
                                        </Switch>
                                        <Switch
                                            isSelected={userVerified}
                                            onValueChange={setUserVerified}
                                        >
                                            Verified
                                        </Switch>
                                    </div>
                                </Panel>
                                {currentUser.linkedAccounts && (
                                    <Panel title='Possibly linked accounts'>
                                        <ul className='list-none m-0'>
                                            {currentUser.linkedAccounts.map((name) => {
                                                return (
                                                    <li key={name}>
                                                        <a
                                                            href='javascript:void(0)'
                                                            onClick={() =>
                                                                findUser({ username: name })
                                                            }
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
                                        <div className='overflow-x-auto'>
                                            <table className='w-full'>
                                                <thead>
                                                    <tr className='border-b border-gray-700'>
                                                        <th className='p-2 text-left'>
                                                            IP Address
                                                        </th>
                                                        <th className='p-2 text-left'>Last Used</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentUser.tokens.map((token) => {
                                                        return (
                                                            <tr key={token.ip}>
                                                                <td className='p-2'>{token.ip}</td>
                                                                <td className='p-2'>
                                                                    {moment(token.lastUsed).format(
                                                                        'YYYY-MM-DD HH:MM'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Panel>
                                )}
                                {user?.permissions.canManagePermissions ? (
                                    <Panel title='Permissions'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                            {permissionsCheckBoxes}
                                        </div>
                                    </Panel>
                                ) : null}
                                <div className='text-center space-x-4'>
                                    <Button
                                        type='button'
                                        color='primary'
                                        onPress={() =>
                                            dispatch(clearUserSessions(currentUser.username))
                                        }
                                    >
                                        Clear sessions
                                    </Button>
                                    <Button
                                        type='button'
                                        color='primary'
                                        onPress={async () => {
                                            try {
                                                await saveUser({
                                                    ...currentUser,
                                                    permissions: currentPermissions,
                                                    verified: userVerified,
                                                    disabled: userDisabled
                                                }).unwrap();
                                            } catch (err) {
                                                // Error will be shown via toastr if present
                                            }
                                        }}
                                    >
                                        Save&nbsp;
                                        {isSaving && <Spinner size='sm' color='current' />}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </Formik>
        </div>
    );
};

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
