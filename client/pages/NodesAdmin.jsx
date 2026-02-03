import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Panel from '../Components/Site/Panel';

import { sendSocketMessage } from '../redux/actions';
import { Col } from 'react-bootstrap';

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

    let content;

    if (!nodeStatus) {
        content = <div>Waiting for game node status from the lobby...</div>;
    } else if (nodeStatus.length > 0) {
        content = (
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
                <tbody>
                    {nodeStatus.map((node) => (
                        <tr key={node.name}>
                            <td>{node.name}</td>
                            <td>{node.numGames}</td>
                            <td>{node.status}</td>
                            <td>{node.version}</td>
                            <td>
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={(event) => onToggleNodeClick(node, event)}
                                >
                                    {node.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={(event) => onRestartNodeClick(node, event)}
                                >
                                    Restart
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    } else {
        content = <div>There are no game nodes connected. This is probably bad.</div>;
    }

    return (
        <Col sm={{ span: 10, offset: 1 }}>
            <Panel title='Game Node Administration'>
                {content}

                <button className='btn btn-default btn-short' onClick={onRefreshClick}>
                    Refresh
                </button>
            </Panel>
        </Col>
    );
};

NodeAdmin.displayName = 'NodeAdmin';

export default NodeAdmin;
