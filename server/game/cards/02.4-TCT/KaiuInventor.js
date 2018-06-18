const DrawCard = require('../../drawcard.js');

class KaiuInventor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: 'holding',
                location: 'province',
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfPhase',
                    targetLocation: 'province',
                    effect: ability.effects.increaseLimitOnAbilities(1)
                })
            },
            effect: 'add an additional use to each of {0}\'s abilities'
        });
    }
}

KaiuInventor.id = 'kaiu-inventor';

module.exports = KaiuInventor;
