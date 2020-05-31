const Card = require('../../Card.js');

class Ambertracker extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'deal 2 damage to each enemy creatures with amber on them',
            gameAction: ability.actions.dealDamage((context) => ({
                ignoreArmor: true,
                target: context.player.opponent.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.amber > 0
                ),
                amount: 2
            }))
        });
    }
}

Ambertracker.id = 'æmbertracker';

module.exports = Ambertracker;
