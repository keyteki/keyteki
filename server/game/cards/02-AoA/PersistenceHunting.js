const Card = require('../../Card.js');

class PersistenceHunting extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== this.controller && card.hasHouse(context.house)
                )
            }))
        });
    }
}

PersistenceHunting.id = 'persistence-hunting';

module.exports = PersistenceHunting;
