const DrawCard = require('../../drawcard.js');

class Spyglass extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            //title: 'Draw a card when commiting to conflict',
            when: {
                onConflictDeclared: event => {
                    console.log(this.name, event.name, event.conflict.isAttacking(this.parent))
                    return event.conflict.isAttacking(this.parent);
                },
                onDefendersDeclared: event => {
                    return event.conflict.isDefending(this.parent);
                },
                onMoveToConflict: event => {
                    console.log(this.name, event.name, event.card === this.parent)
                    return event.card === this.parent;
                }
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
