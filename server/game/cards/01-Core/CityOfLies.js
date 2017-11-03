const DrawCard = require('../../drawcard.js');

class CityOfLies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce cost of next event by 1',
            handler: () => {
                this.game.addMessage('{0} uses {1} to reduce the cost of their next event by 1', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.reduceNextPlayedCardCost(1, card => card.type === 'event')
                }));
            }
        });
    }
}

CityOfLies.id = 'city-of-lies';

module.exports = CityOfLies;
