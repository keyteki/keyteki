const Card = require('../../Card.js');

class ShatteredThrone extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onFight: () => true
            },
            gameAction: ability.actions.capture((context) => ({
                target:
                    context.game.creaturesInPlay.indexOf(context.event.attacker) !== -1
                        ? context.event.attacker
                        : [],
                player: context.event.attacker.controller.opponent
            }))
        });
    }
}

ShatteredThrone.id = 'shattered-throne';

module.exports = ShatteredThrone;
