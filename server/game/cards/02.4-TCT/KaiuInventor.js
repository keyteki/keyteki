const DrawCard = require('../../drawcard.js');

class KaiuInventor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: 'holding',
                cardCondition: card => card.controller === this.controller && !card.facedown
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to add an additional use to each of {2}\'s abilities', this.controller, this, context.target);
                this.lastingEffect(ability => ({
                    match: context.target,
                    targetLocation: 'province',
                    until: {},
                    effect: ability.effects.increaseLimitOnAbilities(1)
                }));
            }
        });
    }
}

KaiuInventor.id = 'kaiu-inventor';

module.exports = KaiuInventor;
