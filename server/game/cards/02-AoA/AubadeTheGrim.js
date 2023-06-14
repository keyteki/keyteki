const Card = require('../../Card.js');

class AubadeTheGrim extends Card {
    // Play: Capture 3A.
    // Reap: Discard 1A from Aubade the Grim.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
        this.reap({
            condition: (context) => context.source.hasToken('amber'),
            effect: 'move 1 amber from Aubade the Grim to the pool',
            gameAction: ability.actions.removeAmber({
                amount: 1
            })
        });
    }
}

AubadeTheGrim.id = 'aubade-the-grim';

module.exports = AubadeTheGrim;
