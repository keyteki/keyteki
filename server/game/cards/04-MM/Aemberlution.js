const Card = require('../../Card.js');

class Amberlution extends Card {
    // Omega.
    // Play: Destroy each creature. Each player reveals their hand and puts each creature from their hand into play ready.
    setupCardAbilities(ability) {
        this.play({
            effect: "destroy each creature, reveal each player's hand, and put creatures from each player's hand into play ready",
            preserveActionMessages: true,
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
                ability.actions.sequentialPutIntoPlay((context) => {
                    const creatures = context.game.allCards.filter(
                        (card) => card.location === 'hand' && card.type === 'creature'
                    );
                    return {
                        revealList: context.game.allCards.filter(
                            (card) => card.location === 'hand'
                        ),
                        forEach: creatures,
                        ready: true,
                        numPlayAllowances: creatures.length
                    };
                })
            ])
        });
    }
}

Amberlution.id = 'æmberlution';

module.exports = Amberlution;
