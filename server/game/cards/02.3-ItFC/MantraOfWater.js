const DrawCard = require('../../drawcard.js');

class MantraOfWater extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a monk and draw a card',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('water') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: ability.actions.ready()
            },
            effect: 'ready {0} and draw a card',
            gameAction: ability.actions.draw()
        });
    }
}

MantraOfWater.id = 'mantra-of-water';

module.exports = MantraOfWater;
