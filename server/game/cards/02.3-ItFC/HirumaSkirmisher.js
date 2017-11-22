const DrawCard = require('../../drawcard.js');

class HirumaSkirmisher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain covert until end of phase',
            when: {
                'onCardEntersPlay': event => event.card === this
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to give {1} covert until the end of the phase', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('covert')
                }));
            }
        });
    }
}

HirumaSkirmisher.id = 'hiruma-skirmisher';

module.exports = HirumaSkirmisher;
