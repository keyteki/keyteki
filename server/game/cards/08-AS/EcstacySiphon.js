import Card from '../../Card.js';

class EcstacySiphon extends Card {
    // Play: Deal 1D to an enemy creature for each card in your
    // opponent’s hand.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.player.opponent ? context.player.opponent.hand.length : 0,
                damageStep: 1
            })),
            effect: "deal 1 damage to an enemy creature for each card in {1}'s hand ",
            effectArgs: (context) => context.player.opponent
        });
    }
}

EcstacySiphon.id = 'ecstacy-siphon';

export default EcstacySiphon;
