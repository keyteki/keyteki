import Card from '../../Card.js';

class DissonantChord extends Card {
    // Play: Deal 3D to a creature. If this damage destroys that creature, stun each of its neighbors after it leaves play.
    // Fate: Stun each friendly creature with A on it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.stun((context) => ({
                    target: context.preThenEvent.clone.neighbors
                })),
                message: '{0} uses {1} to stun {3}',
                messageArgs: (context) => [context.preThenEvent.clone.neighbors]
            }
        });

        this.fate({
            gameAction: ability.actions.stun((context) => ({
                target: context.game.activePlayer.creaturesInPlay.filter((card) => card.amber > 0)
            }))
        });
    }
}

DissonantChord.id = 'dissonant-chord';

export default DissonantChord;
