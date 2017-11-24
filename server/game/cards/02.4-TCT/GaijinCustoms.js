const DrawCard = require('../../drawcard.js');

class GaijinCustoms extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a non-unicorn character',
            condition: () => this.controller.findCard(this.controller.cardsInPlay, card => card.isFaction('unicorn')) || this.controller.stronghold.isFaction('unicorn'),
            target: {
                cardType: 'character',
                cardCondition: (card) => card.location === 'play area' && !card.isFaction('unicorn') && card.bowed
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2}', this.controller, this, context.target);
                this.controller.readyCard(context.target, this);
            }
        });
    }
}

GaijinCustoms.id = 'gaijin-customs';

module.exports = GaijinCustoms;
