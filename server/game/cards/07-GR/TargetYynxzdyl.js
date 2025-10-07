import Card from '../../Card.js';

class TargetYynxzdyl extends Card {
    // Play: Archive a card from your discard pile.
    // After Reap: Archive Target Yynxzdyl.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.archive()
            }
        });

        this.reap({
            gameAction: ability.actions.archive()
        });
    }
}

TargetYynxzdyl.id = 'target-yynxzdyl';

export default TargetYynxzdyl;
