const StrongholdCard = require('../../strongholdcard.js');

class CityOfTheOpenHand extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Steal an honor',
            clickToActivate: true,
            cost: ability.costs.bowSelf(),
            condition: () => this.controller.opponent && this.controller.honor < this.controller.opponent.honor,
            handler: () => {
                this.game.addMessage('{0} bows {1} to steal an honor from {2}', this.controller, this, this.game.getOtherPlayer(this.controller));
                this.game.transferHonor(this.game.getOtherPlayer(this.controller), this.controller, 1);
            }
        });
    }
}

CityOfTheOpenHand.id = 'city-of-the-open-hand';

module.exports = CityOfTheOpenHand;
