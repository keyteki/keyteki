const DrawCard = require('../../drawcard.js');

class SoshiIllusionist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard status from character',
            cost: ability.costs.payFate(1),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && (card.isHonored === true || card.isDishonored === true)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to discard the status token of {2}', this.controller, this, context.target);
                context.target.isHonored = false;
                context.target.isDishonored = false;
            }
        });
    }
}

SoshiIllusionist.id = 'soshi-illusionist';

module.exports = SoshiIllusionist;
