const Card = require('../../Card.js');

class BrawlingGrounds extends Card {
    // Omni: For the remainder of the turn, each time a creature is
    // destroyed in a fight, its controller discards a random card
    // from their hand.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'make the controller of each creature destroyed in a fight this turn discard a card at random for the remainder of the turn',
            gameAction: ability.actions.untilPlayerTurnEnd({
                when: {
                    onCardDestroyed: (event) =>
                        event.clone.type === 'creature' &&
                        !!event.damageEvent &&
                        !!event.damageEvent.fightEvent
                },
                gameAction: ability.actions.discardAtRandom((context) => ({
                    target: context.event.clone.controller
                }))
            })
        });
    }
}

BrawlingGrounds.id = 'brawling-grounds';

module.exports = BrawlingGrounds;
