const DrawCard = require('../../drawcard.js');

class GiverOfGifts extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: 'attachment',
                controller: 'self',
                gameAction: ability.actions.attach(context => ({
                    attachment: context.target,
                    promptForSelect: {
                        controller: 'self',
                        cardCondition: card => card !== context.target.parent,
                        message: '{0} moves {1} to {2}',
                        messageArgs: card => [context.player, context.target, card]
                    }
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
