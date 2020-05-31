const Card = require('../../Card.js');

class SwapWidget extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('mars') && !card.exhausted,
                gameAction: ability.actions.returnToHand()
            },
            then: (preThenContext) => ({
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    location: 'hand',
                    cardCondition: (card) =>
                        card.hasHouse('mars') && card.name !== preThenContext.target.name,
                    gameAction: ability.actions.putIntoPlay()
                },
                message: '{0} puts {2} into play using {1}, and readies it',
                then: (context) => ({
                    gameAction: ability.actions.ready({ target: context.target })
                })
            })
        });
    }
}

SwapWidget.id = 'swap-widget';

module.exports = SwapWidget;
