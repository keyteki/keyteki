const Card = require('../../Card.js');

class MagdaTheRat extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal({ amount: 2})
        });
        this.destroyed({
            triggeredByOppnent: true,
            gameAction: ability.actions.steal({ amount: 2})
        });
    }
}

MagdaTheRat.id = 'magda-the-rat'; // This is a guess at what the id might be - please check it!!!

module.exports = MagdaTheRat;
