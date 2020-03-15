import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';

import * as actions from '../actions';

export class Deckbuilder extends React.Component {
constructor() {
    super();

    console.log(this.props.getCards());
}

render() {
    return ( 
        <Panel title={ 'Deckbuilder' }>
            <Panel title={'Available Cards'}>

            </Panel>
        </Panel>
        ); 
    }
}

Deckbuilder.displayName = 'Deckbuilder';
Deckbuilder.propTypes = {
    getCards: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        apiLoading: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.success : undefined,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(Deckbuilder);
