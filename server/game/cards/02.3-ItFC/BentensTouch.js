const DrawCard = require('../../drawcard.js');

class BentensTouch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Honor a character',
            condition: () => this.game.currentConflict,
            cost: ability.costs.bow(card => card.location === 'play area' && card.hasTrait('shugenja')),
            target: {
                cardType: 'character',
                activePromptTitle: 'Choose a character to honor',
                cardCondition: card => card.isParticipating() && !card.isHonored && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2} and honor {3}', this.controller, this, context.costs.bow, context.target);
                this.controller.honorCard(context.target, this);
            }
        });
    }
}

BentensTouch.id = 'benten-s-touch';

module.exports = BentensTouch;
