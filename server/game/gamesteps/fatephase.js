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
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            this.game.queueSimpleStep(() => this.promptPlayerToDiscard(player, player.cardsInPlay.filter(card => (
                card.fate === 0 && card.allowGameAction('discardFromPlay')
            ))));
        }
    }

    promptPlayerToDiscard(player, cardsToDiscard) {
        if(cardsToDiscard.length === 0) {
            return;
        }
        this.game.promptForSelect(player, {
            source: 'Fate Phase',
            activePromptTitle: 'Choose character to discard\n(or click Done to discard all characters with no fate)',
            waitingPromptTitle: 'Waiting for opponent to discard characters with no fate',
            cardCondition: card => cardsToDiscard.includes(card),
            cardType: 'character',
            controller: 'self',
            buttons: [{ text: 'Done', arg: 'cancel' }],
            onSelect: (player, card) => {
                this.game.applyGameAction(null, { discardFromPlay: card });
                this.promptPlayerToDiscard(player, cardsToDiscard.filter(c => c !== card));
                return true;
            },
            onCancel: () => {
                for(let character of cardsToDiscard) {
                    this.game.applyGameAction(null, { discardFromPlay: character });
                }
            }
        });
    }

    removeFateFromCharacters() {
        this.game.applyGameAction(null, { removeFate: this.game.findAnyCardsInPlay(card => card.allowGameAction('removeFate')) });
    }

    placeFateOnUnclaimedRings() {
        this.game.raiseEvent('onPlaceFateOnUnclaimedRings', {}, () => {
            _.each(this.game.rings, ring => {
                if(!ring.claimed) {
                    ring.modifyFate(1);
                }
            });
        });
    }
}

module.exports = FatePhase;
