import Card from '../../Card.js';

class TerranceSurefoot extends Card {
    // After an enemy creature reaps, move 1A from Terrance Surefoot
    // to the common supply.
    // Play/After Reap: Capture 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            effect: 'move 1 amber from {0} to the pool',
            gameAction: ability.actions.removeAmber({
                amount: 1
            })
        });

        this.play({
            reap: true,
            gameAction: ability.actions.capture()
        });
    }
}

TerranceSurefoot.id = 'terrance-surefoot';

export default TerranceSurefoot;
