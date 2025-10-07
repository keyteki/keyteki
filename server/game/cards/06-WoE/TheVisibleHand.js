import Card from '../../Card.js';

class TheVisibleHand extends Card {
    // Make 2 token creatures. Reveal your hand to your opponent.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'append',
            gameAction: [
                ability.actions.makeTokenCreature({ amount: 2 }),
                ability.actions.reveal((context) => ({
                    target: context.player.hand
                }))
            ]
        });
    }
}

TheVisibleHand.id = 'the-visible-hand';

export default TheVisibleHand;
