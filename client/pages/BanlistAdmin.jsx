import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input, Label, toast } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import ReactTable from '../Components/Table/ReactTable';
import { useAddBanlistMutation, useDeleteBanlistMutation, useGetBanlistQuery } from '../redux/api';
import { adminActions } from '../redux/slices/adminSlice';

const BanlistAdmin = () => {
    const dispatch = useDispatch();
    const [currentRequest, setCurrentRequest] = useState('REQUEST_BANLIST');
    const { isLoading } = useGetBanlistQuery();
    const [addBanlist, addState] = useAddBanlistMutation();
    const [deleteBanlist, deleteState] = useDeleteBanlistMutation();
    const { banlist } = useSelector((state) => ({
        banlist: state.admin.banlist
    }));

    useEffect(() => {
        if (!addState.isSuccess) {
            return;
        }

        toast.success('Banlist item added successfully.');
        addState.reset();
        dispatch(adminActions.clearBanlistStatus());
    }, [addState, dispatch]);

    useEffect(() => {
        if (!deleteState.isSuccess) {
            return;
        }

        toast.success('Banlist item deleted successfully.');
        deleteState.reset();
        dispatch(adminActions.clearBanlistStatus());
    }, [deleteState, dispatch]);

    const onAddBanlistClick = useCallback(
        (state) => {
            setCurrentRequest('ADD_BANLIST');
            addBanlist(state.ip);
        },
        [addBanlist]
    );

    const onDeleteClick = useCallback(
        (id) => {
            setCurrentRequest('DELETE_BANLIST');
            deleteBanlist(id);
        },
        [deleteBanlist]
    );

    const statusBar = useMemo(() => {
        switch (currentRequest) {
            case 'ADD_BANLIST':
                return (
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
                    />
                );
            case 'DELETE_BANLIST':
                return (
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
                    />
                );
            case 'REQUEST_BANLIST':
            default:
                return <ApiStatus state={isLoading ? { loading: true } : null} />;
        }
    }, [addState, currentRequest, deleteState, isLoading]);

    if (isLoading) {
        return 'Loading banlist, please wait...';
    }

    const columns = [
        { accessorKey: 'ip', header: 'Ip' },
        {
            accessorKey: 'added',
            header: 'Added',
            cell: ({ row }) => moment(row.original.added).format('YYYY-MM-DD')
        },
        { accessorKey: 'user', header: 'Added By' },
        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <Button
                    type='button'
                    size='sm'
                    variant='danger'
                    onClick={() => onDeleteClick(row.original.id)}
                >
                    Delete
                </Button>
            )
        }
    ];
    const schema = yup.object({
        ip: yup.string().required('Please enter the Ip address')
    });
    const initialValues = { ip: '' };

    return (
        <div>
            {statusBar}
            <Panel title='Banlist administration'>
                <ReactTable columns={columns} data={banlist} disableSelection isStriped={false} />
            </Panel>
            <Panel title='Add new ip'>
                <Formik
                    validationSchema={schema}
                    onSubmit={onAddBanlistClick}
                    initialValues={initialValues}
                >
                    {(formProps) => (
                        <form onSubmit={formProps.handleSubmit} className='space-y-3'>
                            <div className='grid gap-1 md:grid-cols-12 md:items-start md:gap-2'>
                                <Label
                                    htmlFor='ip'
                                    className='block text-sm text-zinc-100 md:col-span-2 md:pt-2 md:text-right'
                                >
                                    Add ip address
                                </Label>
                                <div className='md:col-span-4'>
                                    <Input
                                        id='ip'
                                        name='ip'
                                        value={formProps.values.ip}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        placeholder='Enter Ip'
                                        variant='tertiary'
                                    />
                                    {formProps.touched.ip && formProps.errors.ip ? (
                                        <div className='mt-1 text-xs text-red-300'>
                                            {formProps.errors.ip}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='md:ml-[16.666667%] md:w-1/3'>
                                <Button
                                    type='submit'
                                    variant='primary'
                                    isPending={addState.isLoading}
                                >
                                    Add
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Panel>
        </div>
    );
};

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
