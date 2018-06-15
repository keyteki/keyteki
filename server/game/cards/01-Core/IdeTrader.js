const DrawCard = require('../../drawcard.js');

class IdeTrader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a fate/card',
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            multipleTrigger: false,
            limit: ability.limit.perConflict(1),
            target: {
                mode: 'select',
                choices: {
                    'Gain 1 fate': ability.actions.gainFate(),
                    'Draw 1 card': ability.actions.draw()
                }
            }
        });
    }
}

IdeTrader.id = 'ide-trader';

module.exports = IdeTrader;
