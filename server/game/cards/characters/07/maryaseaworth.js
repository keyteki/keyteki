const DrawCard = require('../../../drawcard.js');

class MaryaSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event, challenge, source, target) => {
                    this.bypassed = target;
                    return true;
                }
            },
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.bypassed.controller.kneelCard(this.bypassed);
                this.game.addMessage('{0} uses {1} to pay 1 gold to kneel {2}', this.controller, this, this.bypassed);
            }
        });
    }
}

MaryaSeaworth.code = '07025';

module.exports = MaryaSeaworth;
