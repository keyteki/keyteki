const DrawCard = require('../../drawcard.js');

class WayOfTheCrane extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'honor',
                cardCondition: card => card.isFaction('crane') && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { honor: context.target });
            }
        });
    }
}

WayOfTheCrane.id = 'way-of-the-crane';

module.exports = WayOfTheCrane;
