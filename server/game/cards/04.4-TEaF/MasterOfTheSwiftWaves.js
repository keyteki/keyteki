const DrawCard = require('../../drawcard.js');

class MasterOfTheSwiftWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title:'Switch 2 characters you control',
            condition: () => this.game.isDuringConflict(),
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => !card.isParticipating(),
                    gameAction: ability.actions.jointAction([
                        ability.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                        ability.actions.moveToConflict()
                    ])
                }
            },
            effect: 'switch {1} and {2}',
            effectArgs: context => [context.targets.characterInConflict, context.targets.characterAtHome]
        });
    }
}

MasterOfTheSwiftWaves.id = 'master-of-the-swift-waves';

module.exports = MasterOfTheSwiftWaves;
