const Card = require('../../Card.js');

class EssenceScale extends Card {
    // Action: Destroy a friendly creature. If you do, ready and use a friendly creature that shares a house with the destroyed creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card, context) =>
                        context.preThenEvent.clone
                            .getHouses()
                            .some((house) => card.hasHouse(house)),
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                }
            }
        });
    }
}

EssenceScale.id = 'essence-scale';

module.exports = EssenceScale;
