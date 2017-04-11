const DrawCard = require('../../../drawcard.js');

class TheKingsroad extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.action({
            title: 'Kneel and sacrifice',
            clickToActivate: true,
            phase: 'marshal',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: context => {
                // Because the Kingsroad ends up in the discard pile of its owner
                // prior to the reduction being used, we must specifically match
                // it to the player that activated the ability. Otherwise, in
                // cases like Euron Crow's Eye, the reduction will always go to
                // the owner.
                let currentController = context.player;
                this.game.addMessage('{0} kneels and sacrifices {1} to reduce the cost of the next character by 3', currentController, this);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'any',
                    match: player => player === currentController,
                    effect: ability.effects.reduceNextMarshalledCardCost(3, card => card.getType() === 'character')
                }));
            }
        });
    }
}

TheKingsroad.code = '01039';

module.exports = TheKingsroad;
