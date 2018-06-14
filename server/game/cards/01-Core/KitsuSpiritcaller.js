const DrawCard = require('../../drawcard.js');

class KitsuSpiritcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bowSelf(),
            target: {
                activePrompt: 'Choose a character from a discard pile',
                location: ['dynasty discard pile', 'conflict discard pile'],
                controller: 'self',
                gameAction: ability.actions.putIntoConflict()
            },
            effect: 'call {0} back from the dead until the end of the conflict',
            then: context => ({
                gameAction: ability.actions.delayedEffect({
                    target: context.target,
                    when: {
                        onConflictFinished: () => true
                    },
                    message: '{1} returns to the bottom of the deck due to {0}\'s effect',
                    gameAction: ability.actions.returnToDeck({ bottom: true })
                })
            })
        });
    }
}

KitsuSpiritcaller.id = 'kitsu-spiritcaller';

module.exports = KitsuSpiritcaller;
