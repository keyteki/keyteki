const DrawCard = require('../../drawcard.js');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            clickToActivate: true,
            cost: ability.costs.sacrifice(card => card.type === 'character'),
            handler: context => {
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: 'Choose a character to sacrifice',
                    source: this,
                    cardCondition: card => card.location === 'play area',
                    cardType: 'character',
                    buttons: [],
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} sacrifices {1} using {2} to force {3} to sacrifice {4}', this.controller, context.sacrificeCostCard, this, player, card);
                        player.sacrificeCard(card);
                        return true;
                    }
                });
            }
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
