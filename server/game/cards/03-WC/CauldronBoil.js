const Card = require('../../Card.js');

class CauldronBoil extends Card {
    // Play: Deal damage to each creature equal to the amount of damage on that creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'deal damage to creatures equal to their existing damage',
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasToken('damage')
                ),
                amountForCard: (card) => card.tokens.damage
            }))
        });
    }
}

CauldronBoil.id = 'cauldron-boil';

module.exports = CauldronBoil;
