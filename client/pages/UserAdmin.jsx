import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import { Button, Checkbox, Input, Label, Spinner } from '@heroui/react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import ReactTable from '../Components/Table/ReactTable';
import { useFindUserQuery, useSaveUserMutation } from '../redux/api';
import { clearUserSessions } from '../redux/slices/adminSlice';

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

    const sessionColumns = useMemo(
        () => [
            { accessorKey: 'ip', header: 'IP Address' },
            {
                accessorKey: 'lastUsed',
                header: 'Last Used',
                cell: ({ row }) => moment(row.original.lastUsed).format('YYYY-MM-DD HH:MM')
            }
        ],
        []
    );

    return (
        <div className='mx-auto w-full max-w-6xl'>
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
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            formProps.handleSubmit(event);
                        }}
                    >
                        <Panel title='User administration'>
                            <div className='max-w-lg'>
                                <Label
                                    className='mb-1 block text-sm text-zinc-200'
                                    htmlFor='username'
                                >
                                    {t('Username')}
                                </Label>
                                <Input
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder={t('Enter a username')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    variant='secondary'
                                />
                                {formProps.touched.username && formProps.errors.username ? (
                                    <div className='mt-1 text-xs text-red-300'>
                                        {formProps.errors.username}
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-2'>
                                <Button
                                    type='submit'
                                    variant='secondary'
                                    isPending={apiState?.loading}
                                >
                                    Submit&nbsp;
                                    {apiState?.loading ? <Spinner size='sm' /> : null}
                                </Button>
                            </div>
                        </Panel>

                        {currentUser ? (
                            <div>
                                <Panel title={`${currentUser.username} - User details`}>
                                    <dl className='grid grid-cols-[140px_1fr] gap-y-1 text-sm'>
                                        <dt>Username:</dt>
                                        <dd>{currentUser.username}</dd>
                                        <dt>Email:</dt>
                                        <dd>{currentUser.email}</dd>
                                        <dt>Registered:</dt>
                                        <dd>
                                            {moment(currentUser.registered).format(
                                                'YYYY-MM-DD HH:MM'
                                            )}
                                        </dd>
                                    </dl>

                                    <div className='mt-2 grid gap-2 sm:grid-cols-2'>
                                        <Checkbox
                                            className='text-sm text-zinc-200'
                                            isSelected={userDisabled}
                                            onValueChange={(checked) =>
                                                setUserDisabled(Boolean(checked))
                                            }
                                        >
                                            Disabled
                                        </Checkbox>
                                        <Checkbox
                                            className='text-sm text-zinc-200'
                                            isSelected={userVerified}
                                            onValueChange={(checked) =>
                                                setUserVerified(Boolean(checked))
                                            }
                                        >
                                            Verified
                                        </Checkbox>
                                    </div>
                                </Panel>

                                {currentUser.linkedAccounts ? (
                                    <Panel title='Possibly linked accounts'>
                                        <ul className='m-0 list-none'>
                                            {currentUser.linkedAccounts.map((name) => (
                                                <li key={name}>
                                                    <Button
                                                        type='button'
                                                        size='sm'
                                                        variant='light'
                                                        className='min-h-0 min-w-0 px-0 text-sky-300 underline'
                                                        onClick={() => setSearchUsername(name)}
                                                    >
                                                        {name}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </Panel>
                                ) : null}

                                {currentUser.tokens ? (
                                    <Panel title='Sessions'>
                                        <ReactTable
                                            columns={sessionColumns}
                                            data={currentUser.tokens}
                                            disableSelection
                                        />
                                    </Panel>
                                ) : null}

                                {user?.permissions.canManagePermissions ? (
                                    <Panel title='Permissions'>
                                        <div className='grid gap-2 md:grid-cols-3'>
                                            {permissions.map((permission) => (
                                                <Checkbox
                                                    key={`permissions.${permission.name}`}
                                                    className='text-sm text-zinc-200'
                                                    isSelected={
                                                        !!currentPermissions[permission.name]
                                                    }
                                                    onValueChange={() => {
                                                        const nextPermissions = {
                                                            ...currentPermissions,
                                                            [permission.name]:
                                                                !currentPermissions[permission.name]
                                                        };
                                                        setCurrentPermissions(nextPermissions);
                                                    }}
                                                >
                                                    {permission.label}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </Panel>
                                ) : null}

                                <div className='flex justify-center gap-2'>
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        onClick={() =>
                                            dispatch(clearUserSessions(currentUser.username))
                                        }
                                    >
                                        Clear sessions
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        isPending={apiSaveState?.loading}
                                        onClick={() => {
                                            currentUser.permissions = currentPermissions;
                                            currentUser.verified = userVerified;
                                            currentUser.disabled = userDisabled;

                                            saveUser(currentUser);
                                        }}
                                    >
                                        Save&nbsp;
                                        {apiSaveState?.loading ? <Spinner size='sm' /> : null}
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </form>
                )}
            </Formik>
        </div>
    );
};

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
