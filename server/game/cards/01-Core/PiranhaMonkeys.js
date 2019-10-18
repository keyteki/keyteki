const Card = require('../../Card.js');

class PiranhaMonkeys extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            effect: 'deal 2 damage to each other creature',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter(card => card !== context.source)
            }))
        });
    }
}

PiranhaMonkeys.id = 'piranha-monkeys';

module.exports = PiranhaMonkeys;
