const DrawCard = require('../../drawcard.js');

class Spyglass extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            //title: 'Draw a card when commiting to conflict',
            when: {
                onConflictDeclared: event => event.conflict.isAttacking(this.parent),
                onDefendersDeclared: event => event.conflict.isDefending(this.parent),
                onMoveToConflict: event => event.card === this.parent
            },
            limit: ability.limit.perRound(2),
            hander: () => {
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

Spyglass.id = 'spyglass';

module.exports = Spyglass;
