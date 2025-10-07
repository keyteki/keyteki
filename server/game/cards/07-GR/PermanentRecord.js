import Card from '../../Card.js';

class PermanentRecord extends Card {
    // Play: Exhaust a friendly creature. If you do, steal 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: {
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.steal({ amount: 2 }),
                message: '{0} uses {1} to steal 2 amber'
            }
        });
    }
}

PermanentRecord.id = 'permanent-record';

export default PermanentRecord;
