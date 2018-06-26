const ProvinceCard = require('../../provincecard.js');

class SacredSanctuary extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Choose a monk character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            target: {
                controller: 'self',
                cardCondition: card => card.hasTrait('monk'),
                gameAction: [
                    ability.actions.ready(),
                    ability.actions.cardLastingEffect({
                        condition: () => this.game.isDuringConflict(),
                        effect: ability.effects.doesNotBow()
                    }),
                    ability.actions.cardLastingEffect(context => ({
                        effect: ability.effects.cardCannot('bow', abilityContext => (
                            abilityContext.source.type !== 'ring' && context.player.opponent &&
                            abilityContext.source.controller === context.player.opponent
                        ))
                    }))
                ]
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict'
        });
    }
}

SacredSanctuary.id = 'sacred-sanctuary';

module.exports = SacredSanctuary;
