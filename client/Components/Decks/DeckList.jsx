import React from 'react';
import PropTypes from 'prop-types';

import DeckRow from './DeckRow';

import { withTranslation } from 'react-i18next';

class DeckList extends React.Component {
    render() {
        let { activeDeck, className, decks, onSelectDeck, t } = this.props;

        return (
            <div className={ className }>
                {
                    !decks || decks.length === 0
                        ? t('You have no decks, try adding one')
                        : decks.map((deck, index) => <DeckRow active={ activeDeck && activeDeck._id === deck._id } deck={ deck } key={ index } onSelect={ onSelectDeck } />)
                }
            </div>);
    }
}

DeckList.propTypes = {
    activeDeck: PropTypes.object,
    className: PropTypes.string,
    decks: PropTypes.array,
    i18n: PropTypes.object,
    onSelectDeck: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(DeckList);
