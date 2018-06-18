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
                        message: '{0} moves the attachment to {2}'
                    }
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
