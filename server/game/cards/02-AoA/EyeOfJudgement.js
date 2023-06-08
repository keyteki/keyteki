const Card = require('../../Card.js');

class EyeOfJudgement extends Card {
    // Action: Purge a creature from a discard pile.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

EyeOfJudgement.id = 'eye-of-judgment';

module.exports = EyeOfJudgement;
