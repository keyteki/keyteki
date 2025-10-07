import Card from '../../Card.js';

class EldestBatchminder extends Card {
    // At the end of your turn, give each other Mars creature two +1
    // power counters.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (c) => c !== context.source && c.hasHouse('mars')
                ),
                amount: 2
            }))
        });
    }
}

EldestBatchminder.id = 'eldest-batchminder';

export default EldestBatchminder;
