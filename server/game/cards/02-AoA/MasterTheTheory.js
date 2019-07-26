const Card = require('../../Card.js');

class MasterTheTheory extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition:  () => this.controller.creaturesInPlay.length === 0,
            effect: ' to archive a card for each creature {1} has in play ({2}).',
            effectArgs: context => [context.player.opponent, context.player.opponent.creaturesInPlay.length],
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.player.opponent.creaturesInPlay.length,
                action: ability.actions.archive({
                    promptForSelect: {
                        activePromptTitle: 'Choose a card to archive',
                        location: 'hand',
                        controller: 'self'
                    }
                })
            }))
        });
    }
}

MasterTheTheory.id = 'master-the-theory';

module.exports = MasterTheTheory;
