const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Earthbind extends Card {
    setupCardAbilities(ability) {
        this.cardsDiscarded = {};
        this.cardsDiscarded[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.cardsDiscarded[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDiscarded', 'onPhaseStarted']);

        this.whileAttached({
            condition: () => this.cardsDiscarded[this.parent.controller.uuid] === 0,
            effect: ability.effects.cardCannot('use')
        });
    }

    onCardDiscarded(event) {
        if (event.location === 'hand') {
            this.cardsDiscarded[event.card.owner.uuid] += 1;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.cardsDiscarded[this.game.activePlayer.uuid] = 0;
            if (this.game.activePlayer.opponent) {
                this.cardsDiscarded[this.game.activePlayer.opponent.uuid] = 0;
            }
        }
    }
}

Earthbind.id = 'earthbind';

module.exports = Earthbind;
