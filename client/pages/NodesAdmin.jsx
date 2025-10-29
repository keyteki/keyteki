import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Components/HeroUI/Button';

import Panel from '../Components/Site/Panel';
import { sendSocketMessage } from '../redux/actions';

const NodeAdmin = () => {
    const dispatch = useDispatch();
    const nodeStatus = useSelector((state) => state.admin.nodeStatus);

    useEffect(() => {
        dispatch(sendSocketMessage('getnodestatus'));
    }, [dispatch]);

    const onToggleNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(sendSocketMessage('togglenode', node.name));
        },
        [dispatch]
    );

    const onRefreshClick = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(sendSocketMessage('getnodestatus'));
        },
        [dispatch]
    );

    const onRestartNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(sendSocketMessage('restartnode', node.name));
        },
        [dispatch]
    );

    const nodesTable = useMemo(() => {
        if (!nodeStatus || nodeStatus.length === 0) return null;

        const body = nodeStatus.map((node) => {
            return (
                <tr key={node.name}>
                    <td>{node.name}</td>
                    <td>{node.numGames}</td>
                    <td>{node.status}</td>
                    <td>{node.version}</td>
                    <td>
                        <Button
                            color='primary'
                            type='button'
                            onPress={(e) => onToggleNodeClick(node, e)}
                        >
                            {node.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                            color='primary'
                            type='button'
                            onPress={(e) => onRestartNodeClick(node, e)}
                        >
                            Restart
                        </Button>
                    </td>
                </tr>
            );
        });

        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Node Name</th>
                        <th>Num Games</th>
                        <th>Status</th>
                        <th>Version</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{body}</tbody>
            </table>
        );
    }, [nodeStatus, onToggleNodeClick, onRestartNodeClick]);

    let content;
    if (!nodeStatus) {
        content = <div>Waiting for game node status from the lobby...</div>;
    } else if (nodeStatus.length > 0) {
        content = nodesTable;
    } else {
        content = <div>There are no game nodes connected. This is probably bad.</div>;
    }

    return (
        <div className='mx-auto max-w-6xl px-4'>
            <Panel title='Game Node Administration'>
                {content}

                <Button color='secondary' onPress={onRefreshClick}>
                    Refresh
                </Button>
            </Panel>
        </div>
    );
};

NodeAdmin.displayName = 'NodeAdmin';

export default NodeAdmin;
