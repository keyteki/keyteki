const _ = require('underscore');
const Phase = require('./phase.js');
const ActionWindow = require('./actionwindow.js');
const SimpleStep = require('./simplestep.js');

/*
IV Fate Phase
4.1 Fate phase begins.
4.2 Discard characters with no fate.
4.3 Remove fate from characters.
4.4 Place fate on unclaimed rings.
    ACTION WINDOW
4.5 Fate phase ends.
 */

class FatePhase extends Phase {
    constructor(game) {
        super(game, 'fate');
        this.initialise([
            new SimpleStep(game, () => this.discardCharactersWithNoFate()),
            new SimpleStep(game, () => this.removeFateFromCharacters()),
            new SimpleStep(game, () => this.placeFateOnUnclaimedRings()),
            new ActionWindow(this.game, 'Action Window', 'fate')
        ]);
    }

    discardCharactersWithNoFate() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            let cardsToDiscard = player.filterCardsInPlay(card => card.fate === 0 && card.type === 'character' && card.allowGameAction('discardCardFromPlay'));
            this.game.queueSimpleStep(() => player.discardCharactersWithNoFate(cardsToDiscard));
        });
    }
    
    removeFateFromCharacters() {
        let cards = this.game.findAnyCardsInPlay(card => {
            return (card.type === 'character' &&
                    card.allowGameAction('removeFate') &&
                    card.fate > 0);
        });
        this.game.raiseMultipleEvents(_.map(cards, card => ({
            name: 'onCardRemoveFate',
            params: { card: card, fate: 1 }
        })));
    }
    
    placeFateOnUnclaimedRings() {
        this.game.raiseEvent('onPlaceFateOnUnclaimedRings', {}, () => {
            this.game.placeFateOnUnclaimedRings();
        });
    }
}

module.exports = FatePhase;
