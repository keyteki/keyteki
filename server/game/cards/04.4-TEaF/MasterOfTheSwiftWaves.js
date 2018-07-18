const DrawCard = require('../../drawcard.js');

class MasterOfTheSwiftWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title:'Switch 2 characters you control',
            condition: () => this.game.isDuringConflict(),
            gameAction: ability.actions.jointAction([
                ability.actions.sendHome(context => ({
                    promptForSelect: {
                        activePromptTitle: 'Choose a participating character to send home',
                        cardType: 'character',
                        cardCondition: (card,context) => card.isParticipating() && card.controller === context.player,
                        message: '{0} moves {1} back home',
                        messageArgs: card => [context.player, card]
                    }
                })),
                ability.actions.moveToConflict(context => ({
                    promptForSelect: {
                        activePromptTitle: 'Choose a character to move to the conflict',
                        cardType: 'character',
                        cardCondition: (card,context) => !card.isParticipating() && card.controller === context.player,
                        message: '{0} moves {1} to the conflict',
                        messageArgs: card => [context.player, card]
                    }
                }))
            ])
        });
    }
}

MasterOfTheSwiftWaves.id = 'master-of-the-swift-waves';

module.exports = MasterOfTheSwiftWaves;
