import React from 'react';
import PropTypes from 'prop-types';

import AlertPanel from '../Site/AlertPanel';
import DeckList from '../Decks/DeckList.jsx';
import Modal from '../Site/Modal';

class SelectDeckModal extends React.Component {
    render() {
        let decks = null;

        if(this.props.loading) {
            decks = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            decks = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            decks = (
                <div>
                    <DeckList className='deck-list-popup' decks={ this.props.decks } onSelectDeck={ this.props.onDeckSelected } />
                    { this.props.standaloneDecks && this.props.standaloneDecks.length !== 0 && (
                        <div>
                            <h3 className='deck-list-header'>Or choose a standalone deck:</h3>
                            <DeckList className='deck-list-popup' decks={ this.props.standaloneDecks } onSelectDeck={ this.props.onDeckSelected } />
                        </div>)
                    }
                </div>
            );
        }

        return (
            <Modal id={ this.props.id } className='deck-popup' title='Select Deck'>
                { decks }
            </Modal>);
    }
}

SelectDeckModal.displayName = 'SelectDeckModal';
SelectDeckModal.propTypes = {
    apiError: PropTypes.string,
    decks: PropTypes.array,
    id: PropTypes.string,
    loading: PropTypes.bool,
    onDeckSelected: PropTypes.func,
    standaloneDecks: PropTypes.array
};

export default SelectDeckModal;
