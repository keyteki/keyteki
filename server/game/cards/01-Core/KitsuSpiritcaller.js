const DrawCard = require('../../drawcard.js');

class KitsuSpiritcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.currentConflict,
            cost: ability.costs.bowSelf(),
            target: {
                activePrompt: 'Choose a character from a discard pile',
                cardType: 'character',
                cardCondition: card => (card.location === 'dynasty discard pile' || card.location === 'conflict discard pile') && this.controller.canPutIntoPlay(card, true) &&
                                       card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to call {2} back from the dead until the end of the conflict', this.controller, this, context.target);
                this.controller.putIntoPlay(context.target, true);
                this.atEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay()
                }));
            }
        });
    }
}

KitsuSpiritcaller.id = 'kitsu-spiritcaller';

module.exports = KitsuSpiritcaller;
