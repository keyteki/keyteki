import Card from '../../Card.js';

class AllTideUp extends Card {
    // (T) Play: If the tide is high, gain 1A. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.gainAmber({ amount: 1 }),
                falseGameAction: ability.actions.raiseTide()
            }),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'gain 1 amber' : 'raise the tide'
        });
    }
}

AllTideUp.id = 'all-tide-up';

export default AllTideUp;
