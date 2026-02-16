import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
                        <button
                            type='button'
                            className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-zinc-700/80'
                            onClick={(event) => onToggleNodeClick(row.original, event)}
                        >
                            {row.original.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        <button
                            type='button'
                            className='rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-zinc-700/80'
                            onClick={(event) => onRestartNodeClick(row.original, event)}
                        >
                            Restart
                        </button>
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
        <div className='mx-auto w-full max-w-[1100px]'>
            <Panel title='Game Node Administration'>
                {content}

                <button
                    className='mt-2 rounded-md border border-zinc-600/80 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-zinc-700/80'
                    onClick={onRefreshClick}
                >
                    Refresh
                </button>
            </Panel>
        </div>
    );
};

NodeAdmin.displayName = 'NodeAdmin';

export default NodeAdmin;
