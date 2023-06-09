const Card = require('../../Card.js');

class PhylyxTheDisintegrator extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Your opponent loses 1<A> for each other friendly Mars creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.player.cardsInPlay.filter(
                    (card) =>
                        card.type === 'creature' && card.hasHouse('mars') && card !== context.source
                ).length
            }))
        });
    }
}

PhylyxTheDisintegrator.id = 'phylyx-the-disintegrator';

module.exports = PhylyxTheDisintegrator;
