import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Button from '../Components/HeroUI/Button';

import Form from '../Components/Form/Form';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import AlertPanel from '../Components/Site/AlertPanel';
import * as actions from '../redux/actions';

const BanlistAdmin = () => {
    const dispatch = useDispatch();

    const apiAddState = useSelector((state) => state.api.ADD_BANLIST);
    const apiDeleteState = useSelector((state) => state.api.DELETE_BANLIST);
    const apiState = useSelector((state) => state.api.REQUEST_BANLIST);
    const banListAdded = useSelector((state) => state.admin.banlistAdded);
    const banListDeleted = useSelector((state) => state.admin.banlistDeleted);
    const banlist = useSelector((state) => state.admin.banlist);

    const [currentRequest, setCurrentRequest] = useState('REQUEST_BANLIST');
    const [successMessage, setSuccessMessage] = useState(undefined);

    useEffect(() => {
        dispatch(actions.loadBanlist());
    }, [dispatch]);

    useEffect(() => {
        let clearStatus = false;

        if (banListAdded) {
            clearStatus = true;
            setSuccessMessage('Banlist item added successfully.');
        }

        if (banListDeleted) {
            clearStatus = true;
            setSuccessMessage('Banlist item deleted successfully.');
        }

        if (clearStatus) {
            const timeout = setTimeout(() => {
                dispatch(actions.clearBanlistStatus());
                setSuccessMessage(undefined);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [banListAdded, banListDeleted, dispatch]);

    const onAddBanlistClick = useCallback(
        (state) => {
            setCurrentRequest('ADD_BANLIST');
            dispatch(actions.addBanlist(state.ip));
        },
        [dispatch]
    );

    const onDeleteClick = useCallback(
        (id) => {
            setCurrentRequest('DELETE_BANLIST');
            dispatch(actions.deleteBanlist(id));
        },
        [dispatch]
    );

    const handleClearStatus = useCallback(() => {
        dispatch(actions.clearBanlistStatus());
    }, [dispatch]);

    if (apiState && apiState.loading) {
        return 'Loading banlist, please wait...';
    }

    let statusBar;

    switch (currentRequest) {
        case 'REQUEST_BANLIST':
            statusBar = <ApiStatus state={apiState} onClose={handleClearStatus} />;
            break;
        case 'ADD_BANLIST':
            statusBar = <ApiStatus state={apiAddState} onClose={handleClearStatus} />;
            break;
        case 'DELETE_BANLIST':
            statusBar = <ApiStatus state={apiDeleteState} onClose={handleClearStatus} />;
            break;
    }

    let renderedBanlist = banlist.map((entry) => {
        return (
            <tr key={entry.id}>
                <td>{entry.ip}</td>
                <td>{moment(entry.added).format('YYYY-MM-DD')}</td>
                <td>{entry.user}</td>
                <td>
                    <Button
                        color='danger'
                        onPress={() => onDeleteClick(entry.id)}
                        isLoading={apiDeleteState && apiDeleteState.loading}
                    >
                        Delete
                    </Button>
                </td>
            </tr>
        );
    });

    return (
        <div className='flex flex-col gap-4'>
            {statusBar}
            {successMessage && <AlertPanel type='success' message={successMessage} />}
            <Panel title='Banlist administration'>
                <table className='table table-striped w-full'>
                    <thead>
                        <tr>
                            <th className='w-1/4'>Ip</th>
                            <th className='w-1/4'>Added</th>
                            <th className='w-1/3'>Added By</th>
                            <th className='w-1/6'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedBanlist}</tbody>
                </table>
            </Panel>
            <Panel title='Add new ip'>
                <Form
                    name='banlistAdmin'
                    apiLoading={apiAddState && apiAddState.loading}
                    buttonClass='ml-32 w-1/3'
                    buttonText='Add'
                    onSubmit={onAddBanlistClick}
                />
            </Panel>
        </div>
    );
};

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
