const Card = require('../../Card.js');

class PubliusScipio extends Card {
    // Splash-attack 4.
    // Fate: For the remainder of the turn, after you use a friendly creature, deal 4 to its neighbors.
    setupCardAbilities(ability) {
        this.fate({
            effect: 'deal 4 damage to neighbors of friendly creatures used this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onUseCard: (event, context) =>
                        event.card.type === 'creature' &&
                        event.card.controller === context.game.activePlayer
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.event.card.neighbors,
                    amount: 4
                }))
            })
        });
    }
}

PubliusScipio.id = 'publius-scipio';

module.exports = PubliusScipio;
