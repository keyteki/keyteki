const Card = require('../../Card.js');

class StaffUp extends Card {
    // Play: For the remainder of the turn. when any amount of Aember
    // would be added to your pool, make that many token creatures instead.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onModifyAmber: (event, context) =>
                        event.player === context.player && event.amount > 0 && !event.loseAmber
                },
                triggeredAbilityType: 'interrupt',
                gameAction: ability.actions.sequential([
                    ability.actions.makeTokenCreature((context) => ({
                        amount: context.event.amount
                    })),
                    ability.actions.changeEvent((context) => ({
                        event: context.event,
                        amount: 0
                    }))
                ]),
                message: '{0} uses {1} to make {2} token creature{3}',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.event.amount,
                    context.event.amount !== 1 ? 's' : ''
                ]
            }),
            effect:
                'make token creatures when amber would be added to their pool for the remainder of the turn'
        });
    }
}

StaffUp.id = 'staff-up';

module.exports = StaffUp;
