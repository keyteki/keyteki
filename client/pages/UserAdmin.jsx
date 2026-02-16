import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import { Spinner } from '@heroui/react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import ReactTable from '../Components/Table/ReactTable';
import { useFindUserQuery, useSaveUserMutation } from '../redux/api';
import { clearUserSessions } from '../redux/slices/adminSlice';

import './UserAdmin.scss';

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
        <div className='mx-auto w-full max-w-[1100px]'>
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
                            <div className='max-w-[520px]'>
                                <label
                                    className='mb-1 block text-sm text-zinc-200'
                                    htmlFor='username'
                                >
                                    {t('Username')}
                                </label>
                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder={t('Enter a username')}
                                    value={formProps.values.username}
                                    onChange={formProps.handleChange}
                                    onBlur={formProps.handleBlur}
                                    className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                                />
                                {formProps.touched.username && formProps.errors.username ? (
                                    <div className='mt-1 text-xs text-red-300'>
                                        {formProps.errors.username}
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-2'>
                                <button
                                    type='submit'
                                    className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                                >
                                    Submit&nbsp;
                                    {apiState?.loading ? <Spinner size='sm' /> : null}
                                </button>
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
                                        <label className='flex items-center gap-2 text-sm text-zinc-200'>
                                            <input
                                                type='checkbox'
                                                className='h-4 w-4 rounded border-zinc-500 bg-zinc-900/80 accent-red-600'
                                                onChange={() => setUserDisabled(!userDisabled)}
                                                checked={userDisabled}
                                            />
                                            <span>Disabled</span>
                                        </label>
                                        <label className='flex items-center gap-2 text-sm text-zinc-200'>
                                            <input
                                                type='checkbox'
                                                className='h-4 w-4 rounded border-zinc-500 bg-zinc-900/80 accent-red-600'
                                                onChange={() => setUserVerified(!userVerified)}
                                                checked={userVerified}
                                            />
                                            <span>Verified</span>
                                        </label>
                                    </div>
                                </Panel>

                                {currentUser.linkedAccounts ? (
                                    <Panel title='Possibly linked accounts'>
                                        <ul className='list'>
                                            {currentUser.linkedAccounts.map((name) => (
                                                <li key={name}>
                                                    <button
                                                        type='button'
                                                        className='text-sky-300 underline'
                                                        onClick={() => setSearchUsername(name)}
                                                    >
                                                        {name}
                                                    </button>
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
                                                <label
                                                    key={`permissions.${permission.name}`}
                                                    className='flex items-center gap-2 text-sm text-zinc-200'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        className='h-4 w-4 rounded border-zinc-500 bg-zinc-900/80 accent-red-600'
                                                        onChange={() => {
                                                            const nextPermissions = {
                                                                ...currentPermissions,
                                                                [permission.name]:
                                                                    !currentPermissions[
                                                                        permission.name
                                                                    ]
                                                            };
                                                            setCurrentPermissions(nextPermissions);
                                                        }}
                                                        checked={
                                                            !!currentPermissions[permission.name]
                                                        }
                                                    />
                                                    <span>{permission.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Panel>
                                ) : null}

                                <div className='flex justify-center gap-2'>
                                    <button
                                        type='button'
                                        className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                                        onClick={() =>
                                            dispatch(clearUserSessions(currentUser.username))
                                        }
                                    >
                                        Clear sessions
                                    </button>
                                    <button
                                        type='button'
                                        className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                                        onClick={() => {
                                            currentUser.permissions = currentPermissions;
                                            currentUser.verified = userVerified;
                                            currentUser.disabled = userDisabled;

                                            saveUser(currentUser);
                                        }}
                                    >
                                        Save&nbsp;
                                        {apiSaveState?.loading ? <Spinner size='sm' /> : null}
                                    </button>
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
