const DrawCard = require('../../drawcard.js');

class IAmReady extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.discardFate(card => card.isFaction('unicorn')),
            handler: context => {
                this.game.addMessage('{0} uses {1}, discarding a fate to ready {2}', this.controller, this, context.costs.discardFate);
                this.controller.readyCard(context.costs.discardFate);
            }
        });
    }
}

IAmReady.id = 'i-am-ready';

module.exports = IAmReady;
