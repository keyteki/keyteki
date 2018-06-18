const DrawCard = require('../../drawcard.js');

class HidaTomonatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Return a character to deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card => card.isAttacking() && !card.isUnique(),
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

HidaTomonatsu.id = 'hida-tomonatsu';

module.exports = HidaTomonatsu;
