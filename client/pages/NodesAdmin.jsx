import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import ReactTable from '../Components/Table/ReactTable';
import { lobbySendMessage } from '../redux/socketActions';

const NodeAdmin = () => {
    const dispatch = useDispatch();
    const nodeStatus = useSelector((state) => state.admin.nodeStatus);

    useEffect(() => {
        dispatch(lobbySendMessage('getnodestatus'));
    }, [dispatch]);

    const onToggleNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(lobbySendMessage('togglenode', node.name));
        },
        [dispatch]
    );

    const onRefreshClick = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(lobbySendMessage('getnodestatus'));
        },
        [dispatch]
    );

    const onRestartNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(lobbySendMessage('restartnode', node.name));
        },
        [dispatch]
    );

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: 'Node Name' },
            { accessorKey: 'numGames', header: 'Num Games' },
            { accessorKey: 'status', header: 'Status' },
            { accessorKey: 'version', header: 'Version' },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        <Button
                            type='button'
                            size='sm'
                            variant='tertiary'
                            onClick={(event) => onToggleNodeClick(row.original, event)}
                        >
                            {row.original.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                            type='button'
                            size='sm'
                            variant='tertiary'
                            onClick={(event) => onRestartNodeClick(row.original, event)}
                        >
                            Restart
                        </Button>
                    </div>
                )
            }
        ],
        [onRestartNodeClick, onToggleNodeClick]
    );

    let content;

    if (!nodeStatus) {
        content = <div>Waiting for game node status from the lobby...</div>;
    } else if (nodeStatus.length > 0) {
        content = <ReactTable columns={columns} data={nodeStatus} disableSelection />;
    } else {
        content = <div>There are no game nodes connected. This is probably bad.</div>;
    }

    return (
        <div className='mx-auto w-full max-w-6xl'>
            <Panel title='Game Node Administration'>
                {content}

                <Button className='mt-2' size='sm' variant='tertiary' onClick={onRefreshClick}>
                    Refresh
                </Button>
            </Panel>
        </div>
    );
};

NodeAdmin.displayName = 'NodeAdmin';

export default NodeAdmin;
