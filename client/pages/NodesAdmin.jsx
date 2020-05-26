import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';

import * as actions from '../redux/actions';

class NodeAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.onRefreshClick = this.onRefreshClick.bind(this);
    }

    componentDidMount() {
        this.props.sendSocketMessage('getnodestatus');
    }

    onToggleNodeClick(node, event) {
        event.preventDefault();

        this.props.sendSocketMessage('togglenode', node.name);
    }

    onRefreshClick(event) {
        event.preventDefault();

        this.props.sendSocketMessage('getnodestatus');
    }

    onRestartNodeClick(node, event) {
        event.preventDefault();

        this.props.sendSocketMessage('restartnode', node.name);
    }

    getNodesTable() {
        const body = this.props.nodeStatus.map((node) => {
            return (
                <tr key={node.name}>
                    <td>{node.name}</td>
                    <td>{node.numGames}</td>
                    <td>{node.status}</td>
                    <td>{node.version}</td>
                    <td>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={this.onToggleNodeClick.bind(this, node)}
                        >
                            {node.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={this.onRestartNodeClick.bind(this, node)}
                        >
                            Restart
                        </button>
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
    }

    render() {
        let content;

        if (!this.props.nodeStatus) {
            content = <div>Waiting for game node status from the lobby...</div>;
        } else if (this.props.nodeStatus.length > 0) {
            content = this.getNodesTable();
        } else {
            content = <div>There are no game nodes connected. This is probably bad.</div>;
        }

        return (
            <div className='col-sm-offset-1 col-sm-10'>
                <Panel title='Game Node Administration'>
                    {content}

                    <button className='btn btn-default' onClick={this.onRefreshClick}>
                        Refresh
                    </button>
                </Panel>
            </div>
        );
    }
}

NodeAdmin.displayName = 'NodeAdmin';
NodeAdmin.propTypes = {
    nodeStatus: PropTypes.array,
    sendSocketMessage: PropTypes.func
};

function mapStateToProps(state) {
    return {
        nodeStatus: state.admin.nodeStatus
    };
}

export default connect(mapStateToProps, actions)(NodeAdmin);
