import React, { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import Icon from '../Components/Icon';
import { faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Label, toast } from '@heroui/react';
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
            toast.success(t('Blocklist entry added successfully'));
            addState.reset();
            dispatch(userActions.clearBlockListStatus());
        }
    }, [addState, dispatch, t]);

    useEffect(() => {
        if (deleteState.isSuccess) {
            toast.success(t('Blocklist entry deleted successfully'));
            deleteState.reset();
            dispatch(lobbyAuthenticateRequested());
            dispatch(userActions.clearBlockListStatus());
        }
    }, [deleteState, dispatch, t]);

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
                    <Button
                        type='button'
                        size='sm'
                        variant='light'
                        className='min-w-0 p-0 text-red-400 hover:text-red-300'
                        onClick={() =>
                            removeBlockListEntry({
                                username: user.username,
                                blockee: row.original.username
                            })
                        }
                    >
                        <Icon icon={faTimes} />
                    </Button>
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
        <div className='blocklist mx-auto w-full max-w-5xl'>
            <Panel title={t('Block list')}>
                {isBlockListLoading ? (
                    <div>
                        Please wait while the blocklist is loaded...
                        <Icon icon={faCircleNotch} spin />
                    </div>
                ) : (
                    <>
                        <ApiStatus
                            state={
                                addState.isUninitialized
                                    ? null
                                    : {
                                          loading: addState.isLoading,
                                          success: false,
                                          message: addState.error?.data?.message
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
                                          success: false,
                                          message: deleteState.error?.data?.message
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
                                        <div className='max-w-lg'>
                                            <Label
                                                className='mb-1 block text-sm text-zinc-200'
                                                htmlFor='blockee'
                                            >
                                                {t('Username')}
                                            </Label>
                                            <Input
                                                id='blockee'
                                                name='blockee'
                                                type='text'
                                                placeholder={t('Enter username to block')}
                                                value={formProps.values.blockee}
                                                onChange={formProps.handleChange}
                                                onBlur={formProps.handleBlur}
                                                variant='tertiary'
                                            />
                                            {formProps.touched.blockee &&
                                            formProps.errors.blockee ? (
                                                <div className='mt-1 text-xs text-red-300'>
                                                    {formProps.errors.blockee}
                                                </div>
                                            ) : null}
                                        </div>

                                        <Button
                                            type='submit'
                                            className='mt-2'
                                            variant='tertiary'
                                            isPending={addState.isLoading}
                                        >
                                            <Trans>Add</Trans>
                                            &nbsp;
                                            {addState.isLoading ? (
                                                <Icon icon={faCircleNotch} spin />
                                            ) : null}
                                        </Button>

                                        <div className='mt-3'>
                                            <h3 className='font-bold'>
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
