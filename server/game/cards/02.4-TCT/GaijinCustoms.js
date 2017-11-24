const DrawCard = require('../../drawcard.js');

class GaijinCustoms extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose unicorn card, unbow non unicorn card',
            condition: () => this.controller.anyCardsInPlay(card => card.isFaction('unicorn')),
            target: {
                cardType: 'character',
                cardCondition: (card) => card.location === 'play area' && !card.isFaction('unicorn') && card.bowed
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {3}', this.controller, this, context.target);
                this.controller.readyCard(context.target);
            }
        });
    }
}

GaijinCustoms.id = 'gaijin-customs';

module.exports = GaijinCustoms;
