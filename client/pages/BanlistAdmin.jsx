import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import ReactTable from '../Components/Table/ReactTable';
import { useAddBanlistMutation, useDeleteBanlistMutation, useGetBanlistQuery } from '../redux/api';
import { adminActions } from '../redux/slices/adminSlice';

const BanlistAdmin = () => {
    const dispatch = useDispatch();
    const [currentRequest, setCurrentRequest] = useState('REQUEST_BANLIST');
    const [successMessage, setSuccessMessage] = useState(undefined);
    const { isLoading } = useGetBanlistQuery();
    const [addBanlist, addState] = useAddBanlistMutation();
    const [deleteBanlist, deleteState] = useDeleteBanlistMutation();
    const { banListAdded, banListDeleted, banlist } = useSelector((state) => ({
        banListAdded: state.admin.banlistAdded,
        banListDeleted: state.admin.banlistDeleted,
        banlist: state.admin.banlist
    }));

    useEffect(() => {
        if (!banListAdded && !banListDeleted) {
            return;
        }

        if (banListAdded) {
            setSuccessMessage('Banlist item added successfully.');
        } else if (banListDeleted) {
            setSuccessMessage('Banlist item deleted successfully.');
        }

        const timeoutId = setTimeout(() => {
            dispatch(adminActions.clearBanlistStatus());
            setSuccessMessage(undefined);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [banListAdded, banListDeleted, dispatch]);

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
                                      success: addState.isSuccess,
                                      message: addState.isSuccess
                                          ? successMessage
                                          : addState.error?.data?.message
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
                                      success: deleteState.isSuccess,
                                      message: deleteState.isSuccess
                                          ? successMessage
                                          : deleteState.error?.data?.message
                                  }
                        }
                    />
                );
            case 'REQUEST_BANLIST':
            default:
                return (
                    <ApiStatus
                        state={
                            isLoading
                                ? { loading: true }
                                : successMessage
                                ? { loading: false, success: true, message: successMessage }
                                : null
                        }
                    />
                );
        }
    }, [addState, currentRequest, deleteState, isLoading, successMessage]);

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
                <button
                    type='button'
                    className='rounded-md border border-red-500/70 bg-red-700/50 px-3 py-1.5 text-xs text-red-50 transition hover:bg-red-600/60'
                    onClick={() => onDeleteClick(row.original.id)}
                >
                    Delete
                </button>
            )
        }
    ];

    return (
        <div>
            {statusBar}
            <Panel title='Banlist administration'>
                <ReactTable columns={columns} data={banlist} disableSelection isStriped={false} />
            </Panel>
            <Panel title='Add new ip'>
                <Form
                    name='banlistAdmin'
                    apiLoading={addState.isLoading}
                    buttonClass='col-sm-offset-2 col-sm-4'
                    buttonText='Add'
                    onSubmit={onAddBanlistClick}
                />
            </Panel>
        </div>
    );
};

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
