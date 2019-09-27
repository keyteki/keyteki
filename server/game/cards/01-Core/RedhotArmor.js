const Card = require('../../Card.js');

class RedhotArmor extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'remove enemy creatures\' armor and deal damage equal to the amount of armor removed',
            gameAction: ability.actions.dealDamage(context => ({
                target: context.player.opponent.cardsInPlay.filter(card => card.hasToken('armor')),
                reduceArmorBy: card => card.tokens.armor,
                amountForCard: card => card.tokens.armor
            }))
        });
    }
}

RedhotArmor.id = 'red-hot-armor';

module.exports = RedhotArmor;
