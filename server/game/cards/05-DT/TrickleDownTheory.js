import Card from '../../Card.js';

class TrickleDownTheory extends Card {
    // (T) Play: Raise the tide.
    // Omni: Gain 1A if your opponent has 6A or more.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });

        this.omni({
            condition: (context) => context.player.opponent.amber >= 6,
            gameAction: ability.actions.gainAmber()
        });
    }
}

TrickleDownTheory.id = 'trickle-down-theory';

export default TrickleDownTheory;
