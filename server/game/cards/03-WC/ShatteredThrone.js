const Card = require('../../Card.js');

class ShatteredThrone extends Card {
    // After a creature is used to fight, it captures 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event) => !!event.fight
            },
            gameAction: ability.actions.capture((context) => ({
                target:
                    context.game.creaturesInPlay.indexOf(context.event.card) !== -1
                        ? context.event.card
                        : [],
                player: context.event.card.controller.opponent
            }))
        });
    }
}

ShatteredThrone.id = 'shattered-throne';

module.exports = ShatteredThrone;
