import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import { Button, Input, Label, Spinner, Switch, toast } from '@heroui/react';
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
    const lastLoadedUsernameRef = useRef('');
    const findUserState = useFindUserQuery(searchUsername, {
        skip: !searchUsername
    });
    const [saveUser, saveState] = useSaveUserMutation();
    const findUserErrorMessage = findUserState.isError
        ? findUserState.error?.status === 404
            ? 'User was not found.'
            : findUserState.error?.data?.message
        : undefined;
    const apiState =
        findUserState.isUninitialized || (!findUserState.isFetching && !findUserErrorMessage)
            ? null
            : {
                  loading: findUserState.isFetching,
                  success: false,
                  message: findUserErrorMessage
              };
    const dispatch = useDispatch();
    const [isClearingSessions, setIsClearingSessions] = useState(false);
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

    useEffect(() => {
        if (!findUserState.isSuccess || !searchUsername) {
            return;
        }

        if (lastLoadedUsernameRef.current === searchUsername) {
            return;
        }

        lastLoadedUsernameRef.current = searchUsername;
        toast.success(t('User details loaded.'));
    }, [findUserState.isSuccess, searchUsername, t]);

    useEffect(() => {
        if (saveState.isSuccess) {
            toast.success(t('User details saved.'));
            saveState.reset();
            return;
        }

        if (saveState.isError) {
            toast.danger(t(saveState.error?.data?.message || 'Unable to save user details.'));
            saveState.reset();
        }
    }, [saveState, t]);

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

    const handleClearSessions = () => {
        if (!currentUser?.username || isClearingSessions) {
            return;
        }

        setIsClearingSessions(true);
        dispatch(clearUserSessions(currentUser.username));
        toast.success(t('Clear sessions request sent.'));

        setTimeout(async () => {
            try {
                if (findUserState.refetch) {
                    await findUserState.refetch();
                }
                toast.success(t('Sessions refreshed.'));
            } catch (error) {
                toast.danger(t('Unable to refresh sessions.'));
            } finally {
                setIsClearingSessions(false);
            }
        }, 1500);
    };

    return (
        <div className='mx-auto w-full max-w-6xl'>
            <ApiStatus state={apiState} onClose={() => setSearchUsername('')} />
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
                                    variant='tertiary'
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
                                    variant='primary'
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
                                        <div className='flex items-center justify-between rounded-md border border-border/45 bg-surface-secondary/30 px-2 py-1'>
                                            <Label className='text-sm text-foreground'>
                                                Disabled
                                            </Label>
                                            <Switch
                                                id='userDisabled'
                                                isSelected={!!userDisabled}
                                                onChange={(isSelected) =>
                                                    setUserDisabled(Boolean(isSelected))
                                                }
                                            >
                                                <Switch.Control>
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                            </Switch>
                                        </div>
                                        <div className='flex items-center justify-between rounded-md border border-border/45 bg-surface-secondary/30 px-2 py-1'>
                                            <Label className='text-sm text-foreground'>
                                                Verified
                                            </Label>
                                            <Switch
                                                id='userVerified'
                                                isSelected={!!userVerified}
                                                onChange={(isSelected) =>
                                                    setUserVerified(Boolean(isSelected))
                                                }
                                            >
                                                <Switch.Control>
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                            </Switch>
                                        </div>
                                    </div>
                                    {!user?.permissions.canManagePermissions ? (
                                        <div className='mt-3 flex justify-center gap-2 border-t border-border/55 pt-3'>
                                            <Button
                                                type='button'
                                                variant='tertiary'
                                                isPending={isClearingSessions}
                                                isDisabled={isClearingSessions}
                                                onClick={handleClearSessions}
                                            >
                                                Clear sessions
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='primary'
                                                isPending={saveState.isLoading}
                                                onClick={() => {
                                                    saveUser({
                                                        ...currentUser,
                                                        disabled: userDisabled,
                                                        permissions: currentPermissions,
                                                        verified: userVerified
                                                    });
                                                }}
                                            >
                                                Save&nbsp;
                                                {saveState.isLoading ? <Spinner size='sm' /> : null}
                                            </Button>
                                        </div>
                                    ) : null}
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
                                                <div
                                                    key={`permissions.${permission.name}`}
                                                    className='flex items-center justify-between gap-3 rounded-md border border-border/45 bg-surface-secondary/30 px-2 py-1'
                                                >
                                                    <Label className='text-sm text-foreground'>
                                                        {permission.label}
                                                    </Label>
                                                    <Switch
                                                        id={`permissions.${permission.name}`}
                                                        isSelected={
                                                            !!currentPermissions[permission.name]
                                                        }
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
                                                    >
                                                        <Switch.Control>
                                                            <Switch.Thumb />
                                                        </Switch.Control>
                                                    </Switch>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='mt-3 flex justify-center gap-2 border-t border-border/55 pt-3'>
                                            <Button
                                                type='button'
                                                variant='tertiary'
                                                isPending={isClearingSessions}
                                                isDisabled={isClearingSessions}
                                                onClick={handleClearSessions}
                                            >
                                                Clear sessions
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='primary'
                                                isPending={saveState.isLoading}
                                                onClick={() => {
                                                    saveUser({
                                                        ...currentUser,
                                                        disabled: userDisabled,
                                                        permissions: currentPermissions,
                                                        verified: userVerified
                                                    });
                                                }}
                                            >
                                                Save&nbsp;
                                                {saveState.isLoading ? <Spinner size='sm' /> : null}
                                            </Button>
                                        </div>
                                    </Panel>
                                ) : null}
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
