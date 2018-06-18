const DrawCard = require('../../drawcard.js');

class VanguardWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                gameAction: ability.actions.placeFate()
            }
        });
    }
}

VanguardWarrior.id = 'vanguard-warrior';

module.exports = VanguardWarrior;
