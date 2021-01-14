const Card = require('../../Card.js');

class JackieTar extends Card {
    //Elusive. The first time this creature is attacked each turn, no damage is dealt.)
    //Reap: Deal 1 to a creature. If the tide is high, deal 6 to a creature instead.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.isTideHigh() ? 6 : 1
                }))
            }
        });
    }
}

JackieTar.id = 'jackie-tar';

module.exports = JackieTar;
