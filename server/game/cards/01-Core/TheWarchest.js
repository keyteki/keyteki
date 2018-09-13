const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheWarchest extends Card {
    setupCardAbilities(ability) {
        this.enemyCreaturesDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed']);

        this.action({
            gameAction: ability.actions.gainAmber(() => ({ amount: this.enemyCreaturesDestroyed.length }))
        });
    }

    onCardDestroyed(event) {
        if(event.clone.type === 'creature' && event.clone.controller !== this.game.activePlayer && event.inFight) {
            this.enemyCreaturesDestroyed.push(event.card);
        }
    }

    endRound() {
        this.enemyCreaturesDestroyed = [];
        return super.endRound();
    }
}

TheWarchest.id = 'the-warchest'; // This is a guess at what the id might be - please check it!!!

module.exports = TheWarchest;
