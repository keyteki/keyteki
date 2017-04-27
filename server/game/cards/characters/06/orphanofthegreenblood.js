const DrawCard = require('../../../drawcard.js');

class OrphanOfTheGreenblood extends DrawCard {
    setupCardAbilities(ability) {  
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.controller === this.controller &&
                    card !== this &&
                    card.getType() === 'character')
            },
            handler: context => {
                context.target.controller.moveCard(context.target, 'hand');
                this.game.addMessage('{0} discards 1 gold from {1} to return {2} to their hand', 
                                      this.controller, this, context.target);
            }
        });
    }
}

OrphanOfTheGreenblood.code = '06035';

module.exports = OrphanOfTheGreenblood;
