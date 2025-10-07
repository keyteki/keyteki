import Card from '../../Card.js';

class TheCorpulentCollector extends Card {
    // Play: Capture all of your opponent's A. Deal 1D to The Corpulent Collector for each A on it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.dealDamage((context) => ({
                    target: context.source,
                    amount: context.source.amber ? context.source.amber : 0
                }))
            ])
        });
    }
}

TheCorpulentCollector.id = 'the-corpulent-collector';

export default TheCorpulentCollector;
