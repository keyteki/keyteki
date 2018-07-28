const DrawCard = require('../../drawcard.js');

class NezumiInfiltrator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.immuneTo({
                    restricts: 'maho',
                    source: this
                }),
                ability.effects.immuneTo({
                    restricts: 'shadowlands',
                    source: this
                })]
        }),
        this.reaction({
            title: 'Change attacked province\'s strength',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            max: ability.limit.perConflict(1),
            effect: 'change the province strength of {1}',
            effectArgs: context => context.game.currentConflict.conflictProvince,
            gameAction: ability.actions.chooseAction(() => ({
                target: this.game.currentConflict.conflictProvince,
                messages: {
                    'Raise attacked province\'s strength by 1': '{0} chooses to increase {1}\'s strength by 1',
                    'Lower attacked province\'s strength by 1': '{0} chooses to reduce {1}\'s strength by 1'
                },
                choices: {
                    'Raise attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                        targetLocation: 'province',
                        effect: ability.effects.modifyProvinceStrength(1)
                    })),
                    'Lower attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                        targetLocation: 'province',
                        effect: (
                            this.game.currentConflict.conflictProvince.getStrength() > 1 ?
                                ability.effects.modifyProvinceStrength(-1) : []
                        )
                    }))
                }
            }))
        });
    }
}

NezumiInfiltrator.id = 'nezumi-infiltrator';

module.exports = NezumiInfiltrator;
