const Card = require('../../Card.js');

class NiffleBrute extends Card {
    // Destroyed: If Niffle Sanctuary is in your discard pile, return
    // it to your hand. Otherwise, return a Niffle card from your
    // discard pile to your hand.
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'to return a card from their discard pile to their hand',
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    context.player.discard.some((c) => c.name === 'Niffle Sanctuary'),
                trueGameAction: ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    promptForSelect: {
                        activePromptTitle: 'Choose a Niffle Sanctuary',
                        controller: 'self',
                        cardType: 'artifact',
                        cardCondition: (card) => card.name === 'Niffle Sanctuary',
                        location: 'discard',
                        message: '{0} uses {1} to return {2} to their hand',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })),
                falseGameAction: ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    promptForSelect: {
                        activePromptTitle: 'Choose a Niffle card',
                        controller: 'self',
                        cardCondition: (card) => card.hasTrait('niffle'),
                        location: 'discard',
                        message: '{0} uses {1} to return {2} to their hand',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                }))
            })
        });
    }
}

NiffleBrute.id = 'niffle-brute';

module.exports = NiffleBrute;
