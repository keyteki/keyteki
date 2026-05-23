const Card = require('../../Card.js');

class Amberlution extends Card {
    // Omega.
    // Play: Destroy each creature. Each player reveals their hand and puts each creature from their hand into play ready.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                message:
                    "{0} uses {1} to reveal {3}'s hand ({4}) and reveal {5}'s hand ({6}) and put each revealed creature into play ready",
                messageArgs: (context) => {
                    const p1Hand = context.player.hand;
                    const p2Hand = context.player.opponent ? context.player.opponent.hand : [];
                    return [
                        context.player,
                        p1Hand.length ? p1Hand : 'empty',
                        context.player.opponent || 'no opponent',
                        p2Hand.length ? p2Hand : 'empty'
                    ];
                },
                gameAction: ability.actions.sequentialPutIntoPlay((context) => {
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
            }
        });
    }
}

Amberlution.id = 'æmberlution';

module.exports = Amberlution;
