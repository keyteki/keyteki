const DrawCard = require('../../drawcard.js');

class SteadfastWitchHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready character',
            cost: ability.costs.sacrifice(card => card.getType() === 'character'),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card =>
                    card.location === 'play area'
                    && card.bowed
                    && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} and sacrifices {2} to stand {3}', this.controller, this, context.sacrificeCostCard, context.target);
                context.target.controller.readyCard(context.target);
            }
        });
    }
}

SteadfastWitchHunter.id = 'steadfast-witch-hunter';

module.exports = SteadfastWitchHunter;
