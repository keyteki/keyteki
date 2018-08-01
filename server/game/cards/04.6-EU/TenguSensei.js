const DrawCard = require('../../drawcard.js');

class TenguSensei extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent a character from attacking this phase',
            when: {
                onAbilityResolved: (event, context) => event.card === context.source && event.context.ability.title === 'covert'
            },
            effect: 'prevent {1} from attacking this phase',
            effectArgs: context => context.event.context.target,
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.event.context.target,
                duration: 'untilEndOfPhase',
                effect: ability.effects.cardCannot('declareAsAttacker')
            }))
        });
    }
}

TenguSensei.id = 'tengu-sensei';

module.exports = TenguSensei;
