import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Input from '../Components/Form/Input';
import * as actions from '../actions';

class BlockList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            detailsLoaded: false
        };
    }

    componentWillMount() {
        if(this.props.user) {
            this.props.loadBlockList(this.props.user);

            this.setState({ detailsLoaded: true });
        }
    }

    componentWillReceiveProps(props) {
        if(!this.state.detailsLoaded && props.user) {
            this.props.loadBlockList(props.user);

            this.setState({ detailsLoaded: true });
        }
    }

    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    onAddClick(event) {
        event.preventDefault();

        this.props.addBlockListEntry(this.props.user, this.state.username);
    }

    onRemoveClick(username, event) {
        event.preventDefault();

        this.props.removeBlockListEntry(this.props.user, username);
    }

    render() {
        let successPanel;

        if(this.props.blockListAdded) {
            setTimeout(() => {
                this.props.clearBlockListStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Block list entry added successfully' type={ 'success' } />
            );
            this.props.socket.emit('authenticate', this.props.token);
        }

        if(this.props.blockListDeleted) {
            setTimeout(() => {
                this.props.clearBlockListStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Block list entry removed successfully' type={ 'success' } />
            );
            this.props.socket.emit('authenticate', this.props.token);
        }

        let content;
        let blockList = this.props.blockList.map(user => {
            return (
                <tr key={ user }>
                    <td>{ user }</td>
                    <td><a href='#' className='btn' onClick={ this.onRemoveClick.bind(this, user) }><span className='glyphicon glyphicon-remove' /></a></td>
                </tr>
            );
        });

        let table = (this.props.blockList && this.props.blockList.length === 0) ? <div>No users currently blocked</div> : (
            <table className='table table-striped blocklist'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    { blockList }
                </tbody>
            </table>
        );

        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;

        if(this.props.apiLoading) {
            content = <div>Loading block list from the server...</div>;
        } else {
            content = (
                <div className='col-sm-8 col-sm-offset-2 full-height'>
                    <div className='about-container'>
                        { successPanel }
                        { errorBar }

                        <form className='form form-horizontal'>
                            <Panel title='Block list'>
                                <p>It can sometimes become necessary to prevent someone joining your games, or stop seeing their messages, or both.
                                Users on this list will not be able to join your games, and you will not see their chat messages or their games.
                                </p>

                                <div className='form-group'>
                                    <Input name='blockee' label='Username' labelClass='col-sm-4' fieldClass='col-sm-4' placeholder='Enter username to block'
                                        type='text' onChange={ this.onUsernameChange.bind(this) } value={ this.state.username } noGroup />
                                    <button className='btn btn-primary col-sm-1' onClick={ this.onAddClick.bind(this) }>Add</button>
                                </div>

                                <h3>Users Blocked</h3>
                                { table }
                            </Panel>
                        </form>
                    </div>
                </div>);
        }

        return content;
    }
}

BlockList.displayName = 'BlockList';
BlockList.propTypes = {
    addBlockListEntry: PropTypes.func,
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    blockList: PropTypes.array,
    blockListAdded: PropTypes.bool,
    blockListDeleted: PropTypes.bool,
    clearBlockListStatus: PropTypes.func,
    loadBlockList: PropTypes.func,
    loading: PropTypes.bool,
    removeBlockListEntry: PropTypes.func,
    socket: PropTypes.object,
    token: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.loading : undefined,
        apiMessage: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.message : undefined,
        apiSuccess: state.api.ADD_BLOCKLIST ? state.api.ADD_BLOCKLIST.success : undefined,
        blockList: state.user.blockList,
        blockListAdded: state.user.blockListAdded,
        blockListDeleted: state.user.blockListDeleted,
        socket: state.lobby.socket,
        token: state.account.token,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(BlockList);
