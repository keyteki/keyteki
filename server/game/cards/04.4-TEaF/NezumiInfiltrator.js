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
            target: {
                gameAction: ability.actions.chooseAction(() => ({
                    messages: {
                        'Raise attacked province\'s strength by 1': '{0} chooses to increase {1}\'s strength by 1',
                        'Lower attacked province\'s strength by 1': '{0} chooses to reduce {1}\'s strength by 1'
                    },
                    choices: {
                        'Raise attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                            target: this.game.currentConflict.conflictProvince,
                            effect: ability.effects.modifyProvinceStrength(1)
                        })),
                        'Lower attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                            target: this.game.currentConflict.conflictProvince,
                            effect: (
                                this.game.currentConflict.conflictProvince.getStrength() > 1 ?
                                    ability.effects.modifyProvinceStrength(-1) : []
                            )
                        }))
                    }
                }))
            }
        });
    }
}

NezumiInfiltrator.id = 'nezumi-infiltrator';

module.exports = NezumiInfiltrator;
