const DrawCard = require('../../drawcard.js');

class FairAccord extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard favor to gain to 2 fate',
            phase: 'dynasty',
            cost: ability.costs.discardImperialFavor(),
            handler: () => {
                this.game.addMessage('{0} uses {1} discarding the favor to gain 2 fate', this.controller, this);
                this.game.addFate(this.controller,2);
            }
        });
    }
}

FairAccord.id = 'fair-accord';

module.exports = FairAccord;
