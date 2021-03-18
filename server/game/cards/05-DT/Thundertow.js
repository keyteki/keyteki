const Card = require('../../Card.js');

class Thundertow extends Card {
    //Play: Exhaust 2 creatures. Deal 2D to each exhausted creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: '2',
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.exhausted),
                amount: 2
            }))
        });
    }
}

Thundertow.id = 'thundertow';

module.exports = Thundertow;
