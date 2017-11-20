const DrawCard = require('../../drawcard.js');

class VanguardWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                context.target.modifyFate(1);
                this.game.addMessage('{0} sacrifices {1} to put one fate on {2}', this.controller, this, context.target);
            }
        });
    }
}

VanguardWarrior.id = 'vanguard-warrior';

module.exports = VanguardWarrior;
