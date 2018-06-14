const StrongholdCard = require('../../strongholdcard.js');

class CityOfTheOpenHand extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Steal an honor',
            cost: ability.costs.bowSelf(),
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            gameAction: ability.actions.takeHonor()
        });
    }
}

CityOfTheOpenHand.id = 'city-of-the-open-hand';

module.exports = CityOfTheOpenHand;
