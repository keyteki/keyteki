import React, { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import ReactTable from '../Components/Table/ReactTable';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../redux/api';
import { userActions } from '../redux/slices/userSlice';
import { lobbyAuthenticateRequested } from '../redux/socketActions';

import './BlockList.scss';

const BlockList = () => {
    const { user } = useSelector((state) => ({
        user: state.account.user
    }));
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const blockList = useSelector((state) => state.user.blockList);
    const [addBlockListEntry, addState] = useAddBlockListEntryMutation();
    const [removeBlockListEntry, deleteState] = useRemoveBlockListEntryMutation();
    const { isLoading: isBlockListLoading } = useGetBlockListQuery(user?.username, {
        skip: !user
    });

    useEffect(() => {
        if (addState.isSuccess) {
            const timeoutId = setTimeout(() => {
                addState.reset();
                dispatch(userActions.clearBlockListStatus());
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [addState, dispatch]);

    useEffect(() => {
        if (deleteState.isSuccess) {
            const timeoutId = setTimeout(() => {
                deleteState.reset();
                dispatch(lobbyAuthenticateRequested());
                dispatch(userActions.clearBlockListStatus());
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [deleteState, dispatch]);

    const initialValues = {
        blockee: ''
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'username', header: t('Username') },
            {
                id: 'remove',
                header: t('Remove'),
                cell: ({ row }) => (
                    <button
                        type='button'
                        className='text-red-400 hover:text-red-300'
                        onClick={() =>
                            removeBlockListEntry({
                                username: user.username,
                                blockee: row.original.username
                            })
                        }
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )
            }
        ],
        [removeBlockListEntry, t, user?.username]
    );

    if (!blockList) {
        return null;
    }

    const rows = blockList.map((username) => ({ username }));

    const schema = yup.object({
        blockee: yup.string().required(t('You must specify a username to block'))
    });

    return (
        <div className='mx-auto w-full max-w-[960px]'>
            <Panel title={t('Block list')}>
                {isBlockListLoading ? (
                    <div>
                        Please wait while the blocklist is loaded...
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                ) : (
                    <>
                        <ApiStatus
                            state={
                                addState.isUninitialized
                                    ? null
                                    : {
                                          loading: addState.isLoading,
                                          success: addState.isSuccess,
                                          message: addState.isSuccess
                                              ? t('Blocklist entry added successfully')
                                              : addState.error?.data?.message
                                      }
                            }
                            onClose={() => addState.reset()}
                        />
                        <ApiStatus
                            state={
                                deleteState.isUninitialized
                                    ? null
                                    : {
                                          loading: deleteState.isLoading,
                                          success: deleteState.isSuccess,
                                          message: deleteState.isSuccess
                                              ? t('Blocklist entry deleted successfully')
                                              : deleteState.error?.data?.message
                                      }
                            }
                            onClose={() => deleteState.reset()}
                        />
                        <div className='about-container'>
                            <Formik
                                validationSchema={schema}
                                onSubmit={(values) => {
                                    addBlockListEntry({
                                        username: user.username,
                                        blockee: values.blockee
                                    });
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
                                        <p>
                                            <Trans i18nKey='blocklist.explain'>
                                                It can sometimes become necessary to prevent someone
                                                joining your games, or stop seeing their messages,
                                                or both. Users on this list will not be able to join
                                                your games, and you will not see their chat messages
                                                or their games.
                                            </Trans>
                                        </p>
                                        <div className='max-w-[520px]'>
                                            <label
                                                className='mb-1 block text-sm text-zinc-200'
                                                htmlFor='blockee'
                                            >
                                                {t('Username')}
                                            </label>
                                            <input
                                                id='blockee'
                                                name='blockee'
                                                type='text'
                                                placeholder={t('Enter username to block')}
                                                value={formProps.values.blockee}
                                                onChange={formProps.handleChange}
                                                onBlur={formProps.handleBlur}
                                                className='w-full rounded-md border border-zinc-600/70 bg-black/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-400/80 focus:outline-none'
                                            />
                                            {formProps.touched.blockee &&
                                            formProps.errors.blockee ? (
                                                <div className='mt-1 text-xs text-red-300'>
                                                    {formProps.errors.blockee}
                                                </div>
                                            ) : null}
                                        </div>

                                        <button
                                            type='submit'
                                            className='mt-2 rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700/80'
                                        >
                                            <Trans>Add</Trans>
                                            &nbsp;
                                            {addState.isLoading ? (
                                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                            ) : null}
                                        </button>

                                        <div className='mt-3'>
                                            <h3 className='font-weight-bold'>
                                                <Trans>Users Blocked</Trans>
                                            </h3>
                                            {rows.length === 0 ? (
                                                <div>
                                                    <Trans>No users currently blocked</Trans>
                                                </div>
                                            ) : (
                                                <ReactTable
                                                    columns={columns}
                                                    data={rows}
                                                    disableSelection
                                                    isStriped={false}
                                                />
                                            )}
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </>
                )}
            </Panel>
        </div>
    );
};

BlockList.displayName = 'BlockList';

export default BlockList;
