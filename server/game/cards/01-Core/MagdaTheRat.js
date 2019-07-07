const Card = require('../../Card.js');

class MagdaTheRat extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal({ amount: 2 })
        });
        this.leavesPlay({
            triggeredByOpponent: true,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

MagdaTheRat.id = 'magda-the-rat';

module.exports = MagdaTheRat;
