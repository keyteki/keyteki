import Card from '../../Card.js';

class PourTal extends Card {
    // (T) Play: If the tide is high, archive Pour-tal. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.archive((context) => ({
                    target: context.source
                })),
                falseGameAction: ability.actions.raiseTide()
            }),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'archive itself' : 'raise the tide'
        });
    }
}

PourTal.id = 'pour-tal';

export default PourTal;
