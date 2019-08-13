import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import * as actions from '../actions';

class BanlistAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ip: '',
            currentRequest: 'REQUEST_BANLIST'
        };

        this.onAddBanlistClick = this.onAddBanlistClick.bind(this);
    }

    componentWillMount() {
        this.props.loadBanlist();
    }

    componentWillReceiveProps(props) {
        let clearStatus = false;
        if(props.banListAdded) {
            clearStatus = true;
            this.setState({ successMessage: 'Banlist item added successfully.' });
        }

        if(props.banListDeleted) {
            clearStatus = true;
            this.setState({ successMessage: 'Banlist item deleted successfully.' });
        }

        if(clearStatus) {
            setTimeout(() => {
                this.props.clearBanlistStatus();
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    onIpTextChange(event) {
        this.setState({ ip: event.target.value });
    }

    onAddBanlistClick(state) {
        this.setState({ currentRequest: 'ADD_BANLIST' });
        this.props.addBanlist(state.ip);
    }

    onDeleteClick(id) {
        this.setState({ currentRequest: 'DELETE_BANLIST' });
        this.props.deleteBanlist(id);
    }

    render() {
        if(this.props.apiState && this.props.apiState.loading) {
            return 'Loading banlist, please wait...';
        }

        let statusBar;

        switch(this.state.currentRequest) {
            case 'REQUEST_BANLIST':
                statusBar = <ApiStatus apiState={ this.props.apiState } successMessage={ this.state.successMessage } />;
                break;
            case 'ADD_BANLIST':
                statusBar = <ApiStatus apiState={ this.props.apiAddState } successMessage={ this.state.successMessage } />;
                break;
            case 'DELETE_BANLIST':
                statusBar = <ApiStatus apiState={ this.props.apiDeleteState } successMessage={ this.state.successMessage } />;
                break;
        }

        let renderedBanlist = this.props.banlist.map(entry => {
            return (<tr key={ entry._id }>
                <td>{ entry.ip }</td>
                <td>{ moment(entry.added).format('YYYY-MM-DD') }</td>
                <td>{ entry.user }</td>
                <td>
                    <button type='button' className='btn btn-danger' onClick={ this.onDeleteClick.bind(this, entry._id) }>Delete { this.props.apiDeleteState &&
                        this.props.apiDeleteState.loading && <span className='spinner button-spinner' /> }</button>
                </td>
            </tr>);
        });

        return (
            <div className='col-xs-12'>
                { statusBar }
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
                            { renderedBanlist }
                        </tbody>
                    </table>
                </Panel>
                <Panel title='Add new ip'>
                    <Form name='banlistAdmin' apiLoading={ this.props.apiAddState && this.props.apiAddState.loading } buttonClass='col-sm-offset-2 col-sm-4' buttonText='Add' onSubmit={ this.onAddBanlistClick } />
                </Panel>
            </div>);
    }
}

BanlistAdmin.displayName = 'BanlistAdmin';
BanlistAdmin.propTypes = {
    addBanlist: PropTypes.func,
    apiAddState: PropTypes.object,
    apiDeleteState: PropTypes.object,
    apiState: PropTypes.object,
    banListAdded: PropTypes.bool,
    banListDeleted: PropTypes.bool,
    banlist: PropTypes.array,
    clearBanlistStatus: PropTypes.func,
    deleteBanlist: PropTypes.func,
    loadBanlist: PropTypes.func,
    successMessage: PropTypes.string
};

function mapStateToProps(state) {
    return {
        apiAddState: state.api.ADD_BANLIST,
        apiDeleteState: state.api.DELETE_BANLIST,
        apiState: state.api.REQUEST_BANLIST,
        banlistAdded: state.admin.banlistAdded,
        banlistDeleted: state.admin.banlistDeleted,
        banlist: state.admin.banlist,
        loadBanlist: state.admin.loadBanlist,
        loading: state.api.loading
    };
}

export default connect(mapStateToProps, actions)(BanlistAdmin);
