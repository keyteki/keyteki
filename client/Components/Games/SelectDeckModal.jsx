import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Site/AlertPanel';
import DeckList from '../Decks/DeckList.jsx';
import Modal from '../Site/Modal';

import { withTranslation, Trans } from 'react-i18next';

class SelectDeckModal extends React.Component {
    render() {
        let t = this.props.t;
        let decks = null;

        if(this.props.loading) {
            decks = <div><Trans>Loading decks from the server...</Trans></div>;
        } else if(this.props.apiError) {
            decks = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            decks = (
                <div>
                    <DeckList className='deck-list-popup' decks={ this.props.decks } onSelectDeck={ this.props.onDeckSelected } />
                    { this.props.standaloneDecks && this.props.standaloneDecks.length !== 0 && (
                        <div>
                            <h3 className='deck-list-header'><Trans>Or choose a standalone deck</Trans>:</h3>
                            <DeckList className='deck-list-popup' decks={ this.props.standaloneDecks } onSelectDeck={ this.props.onDeckSelected } />
                        </div>)
                    }
                </div>
            );
        }

        return (
            <Modal id={ this.props.id } bodyClassName='col-xs-12 deck-body' className='deck-popup' title={ t('Select Deck') }>
                { decks }
            </Modal>);
    }
}

SelectDeckModal.displayName = 'SelectDeckModal';
SelectDeckModal.propTypes = {
    apiError: PropTypes.string,
    decks: PropTypes.array,
    i18n: PropTypes.object,
    id: PropTypes.string,
    loading: PropTypes.bool,
    onDeckSelected: PropTypes.func,
    standaloneDecks: PropTypes.array,
    t: PropTypes.func
};

export default withTranslation()(SelectDeckModal);
