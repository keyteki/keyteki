const DrawCard = require('../../drawcard.js');

class GiverOfGifts extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: 'attachment',
                cardCondition: card => card.controller === this.controller && card.location === 'play area'
            },
            handler: context => this.game.promptForSelect(this.controller, {
                source: this,
                cardType: 'character',
                cardCondition: card => this.controller.canAttach(context.target, card) && card.controller === this.controller && card !== context.target.parent,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1} to move {2} from {3} to {4}', player, this, context.target, context.target.parent, card);
                    player.attach(context.target, card);
                    return true;
                }
            })
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
