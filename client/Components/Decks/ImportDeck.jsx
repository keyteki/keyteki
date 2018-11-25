import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Input from '../Form/Input';
import * as actions from '../../actions';

export class ImportDeck extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            deckString: ''
        };

        this.onImportDeck = this.onImportDeck.bind(this);
        this.onDeckStringChange = this.onDeckStringChange.bind(this);
    }

    componentWillUpdate(props) {
        if(props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onImportDeck() {
        this.setState({ error: '' });
        let split = String(this.state.deckString).split('/');
        if(split[2] === 'www.keyforgegame.com' && split[3] === 'deck-details') {
            this.props.saveDeck({ uuid: split[4] });
        } else {
            this.setState({ error: 'The URL you entered is invalid.  Please check it and try again.' });
        }
    }

    onDeckStringChange(event) {
        this.setState({ deckString: event.target.value });
    }

    render() {
        let content;

        if(this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    <div className='col-md-8 col-md-offset-2 profile full-height'>
                        { this.state.error && <AlertPanel type='error' message={ this.state.error } /> }
                        <Panel title='Import Deck'>
                            <p>
                                Enter the deck link from the <a href='https://keyforgegame.com' target='_blank'>keyforge website.</a>
                            </p>
                            <p>Either search for a deck, or find one from the "My Decks" section of the website.  Find the URL of the deck and paste it in to the box below.</p>
                            <p>The URL looks like this: </p>
                            <p><code>https://www.keyforgegame.com/deck-details/00000000-0000-0000-0000-000000000000</code></p>
                            <Input name='importUrl' fieldClass='col-xs-9' placeholder='link' type='text' onChange={ this.onDeckStringChange } value={ this.state.deckString } >
                                <div className='col-xs-1'>
                                    <button className='btn btn-default' onClick={ this.onImportDeck }>Import</button>
                                </div>
                            </Input>
                        </Panel>
                    </div>
                </div>);
        }

        return content;
    }
}

ImportDeck.displayName = 'ImportDeck';
ImportDeck.propTypes = {
    apiError: PropTypes.string,
    deckSaved: PropTypes.bool,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    saveDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        deckSaved: state.cards.deckSaved,
        loading: state.api.loading,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(ImportDeck);
