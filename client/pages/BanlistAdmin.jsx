import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { addBanlist, clearBanlistStatus, deleteBanlist, loadBanlist } from '../redux/actions';
import { Col } from 'react-bootstrap';

const BanlistAdmin = () => {
    const dispatch = useDispatch();
    const [currentRequest, setCurrentRequest] = useState('REQUEST_BANLIST');
    const [successMessage, setSuccessMessage] = useState(undefined);
    const { apiAddState, apiDeleteState, apiState, banListAdded, banListDeleted, banlist } =
        useSelector((state) => ({
            apiAddState: state.api.ADD_BANLIST,
            apiDeleteState: state.api.DELETE_BANLIST,
            apiState: state.api.REQUEST_BANLIST,
            banListAdded: state.admin.banlistAdded,
            banListDeleted: state.admin.banlistDeleted,
            banlist: state.admin.banlist
        }));

    useEffect(() => {
        dispatch(loadBanlist());
    }, [dispatch]);

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
            dispatch(clearBanlistStatus());
            setSuccessMessage(undefined);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [banListAdded, banListDeleted, dispatch]);

    const onAddBanlistClick = useCallback(
        (state) => {
            setCurrentRequest('ADD_BANLIST');
            dispatch(addBanlist(state.ip));
        },
        [dispatch]
    );

    const onDeleteClick = useCallback(
        (id) => {
            setCurrentRequest('DELETE_BANLIST');
            dispatch(deleteBanlist(id));
        },
        [dispatch]
    );

    const statusBar = useMemo(() => {
        switch (currentRequest) {
            case 'ADD_BANLIST':
                return <ApiStatus apiState={apiAddState} successMessage={successMessage} />;
            case 'DELETE_BANLIST':
                return <ApiStatus apiState={apiDeleteState} successMessage={successMessage} />;
            case 'REQUEST_BANLIST':
            default:
                return <ApiStatus apiState={apiState} successMessage={successMessage} />;
        }
    }, [apiAddState, apiDeleteState, apiState, currentRequest, successMessage]);

    if (apiState && apiState.loading) {
        return 'Loading banlist, please wait...';
    }

    return (
        <Col>
            {statusBar}
            <Panel title='Banlist administration'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='col-sm-2'>Ip</th>
                            <th className='col-sm-2'>Added</th>
                            <th className='col-sm-3'>Added By</th>
                            <th className='col-sm-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banlist.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.ip}</td>
                                <td>{moment(entry.added).format('YYYY-MM-DD')}</td>
                                <td>{entry.user}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn btn-danger'
                                        onClick={() => onDeleteClick(entry.id)}
                                    >
                                        Delete{' '}
                                        {apiDeleteState && apiDeleteState.loading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Panel>
            <Panel title='Add new ip'>
                <Form
                    name='banlistAdmin'
                    apiLoading={apiAddState && apiAddState.loading}
                    buttonClass='col-sm-offset-2 col-sm-4'
                    buttonText='Add'
                    onSubmit={onAddBanlistClick}
                />
            </Panel>
        </Col>
    );
};

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
