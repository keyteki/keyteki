const Card = require('../../Card.js');

class EssenceScale extends Card {
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
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house)),
                    gameAction: [ability.actions.ready(), ability.actions.use()]
                }
            }
        });
    }
}

EssenceScale.id = 'essence-scale';

module.exports = EssenceScale;
