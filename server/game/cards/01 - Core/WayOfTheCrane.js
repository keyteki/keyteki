const DrawCard = require('../../drawcard.js');

class WayOfTheCrane extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.isFaction('crane') && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                this.controller.honorCard(context.target);
            }
        });
    }
}

WayOfTheCrane.id = 'way-of-the-crane';

module.exports = WayOfTheCrane;
