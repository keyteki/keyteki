const Card = require('../../Card.js');

class EyeOfJudgement extends Card {
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

EyeOfJudgement.id = 'eye-of-judgement';

module.exports = EyeOfJudgement;
