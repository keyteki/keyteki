import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Input from './FormComponents/Input.jsx';

import * as actions from './actions';

class InnerBlockList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        this.props.loadBlockList(this.props.user);
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
        }

        if(this.props.blockListDeleted) {
            setTimeout(() => {
                this.props.clearBlockListStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Block list entry removed successfully' type={ 'success' } />
            );

        }

        let content;
        let blockList = _.map(this.props.blockList, user => {
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

        if(this.props.loading) {
            content = <div>Loading block list from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div className='col-sm-8 col-sm-offset-2 full-height'>
                    <div className='about-container'>
                        { successPanel }

                        { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                        { this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null }

                        <form className='form form-horizontal'>
                            <div className='panel-title text-center'>
                            Block list
                            </div>
                            <div className='panel'>
                                <p>It can sometimes become necessary to prevent someone joining your games, or stop seeing their messages, or both.
                                Users on this list will not be able to join your games, and you will not see their chat messages or their games.
                                </p>

                                <div className='form-group'>
                                    <Input name='username' label='Username' labelClass='col-sm-4' fieldClass='col-sm-4' placeholder='Enter username to block'
                                        type='text' onChange={ this.onUsernameChange.bind(this) } value={ this.state.username } noGroup />
                                    <button className='btn btn-primary col-sm-1' onClick={ this.onAddClick.bind(this) }>Add</button>
                                </div>

                                <h3>Users Blocked</h3>
                                { table }
                            </div>
                        </form>
                    </div>
                </div>);
        }

        return content;
    }
}

InnerBlockList.displayName = 'BlockList';
InnerBlockList.propTypes = {
    addBlockListEntry: React.PropTypes.func,
    apiError: React.PropTypes.string,
    blockList: React.PropTypes.array,
    blockListAdded: React.PropTypes.bool,
    blockListDeleted: React.PropTypes.bool,
    clearBlockListStatus: React.PropTypes.func,
    loadBlockList: React.PropTypes.func,
    loading: React.PropTypes.bool,
    removeBlockListEntry: React.PropTypes.func,
    user: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        blockList: state.user.blockList,
        blockListAdded: state.user.blockListAdded,
        blockListDeleted: state.user.blockListDeleted,
        loading: state.api.loading,
        user: state.auth.user
    };
}

const BlockList = connect(mapStateToProps, actions)(InnerBlockList);

export default BlockList;
