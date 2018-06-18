const DrawCard = require('../../drawcard.js');

class FairAccord extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard favor to gain 2 fate',
            phase: 'dynasty',
            cost: ability.costs.discardImperialFavor(),
            gameAction: ability.actions.gainFate(2)
        });
    }
}

FairAccord.id = 'fair-accord';

module.exports = FairAccord;
