const DrawCard = require('../../drawcard.js');

class MantraOfFire extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Add 1 fate to a monk and draw a card',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('fire') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: ability.actions.placeFate()
            },
            effect: 'add a fate to {0} and draw a card',
            gameAction: ability.actions.draw()
        });
    }
}

MantraOfFire.id = 'mantra-of-fire';

module.exports = MantraOfFire;
