const Card = require('../../Card.js');

class Friendship extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            // even distribution or single neighbor
            when: {
                onDamageApplied: (event, context) =>
                    event.damageDealtEvent &&
                    !event.isRedirected &&
                    event.amount > 0 &&
                    event.card === context.source.parent &&
                    context.source.parent.neighbors.length > 0 &&
                    (event.amount % 2 === 0 || context.source.parent.neighbors.length == 1)
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                processEvent: (event, context) => {
                    let neighbors = context.source.parent.neighbors;
                    let damagePerNeighbor = event.amount / neighbors.length;
                    if (neighbors[0]) {
                        let childEvent = ability.actions
                            .applyDamage({
                                amount: damagePerNeighbor,
                                damageSource: event.damageSource,
                                damageType: event.damageType,
                                damageDealtEvent: event.damageDealtEvent
                            })
                            .getEvent(neighbors[0], context.game.getFrameworkContext());
                        event.addChildEvent(childEvent);
                    }
                    if (neighbors[1]) {
                        let childEvent = ability.actions
                            .applyDamage({
                                amount: damagePerNeighbor,
                                damageSource: event.damageSource,
                                damageType: event.damageType,
                                damageDealtEvent: event.damageDealtEvent
                            })
                            .getEvent(neighbors[1], context.game.getFrameworkContext());
                        event.addChildEvent(childEvent);
                    }
                    event.amount = 0;
                }
            }))
        });

        this.interrupt({
            // uneven distribution with two neighbors
            when: {
                onDamageApplied: (event, context) =>
                    event.damageDealtEvent &&
                    !event.isRedirected &&
                    event.amount > 0 &&
                    event.card === context.source.parent &&
                    context.source.parent.neighbors.length === 2 &&
                    event.amount % 2 === 1
            },
            target: {
                activePromptTitle: 'Select a neighbor to receive extra damage',
                cardType: 'creature',
                controller: 'any',
                cardCondition: (card, context) =>
                    context.source.parent.neighbors.some((c) => c === card),
                gameAction: ability.actions.changeEvent((context) => ({
                    event: context.event,
                    processEvent: (event, context) => {
                        let neighbors = context.source.parent.neighbors;
                        let damagePerNeighbor = Math.floor(event.amount / 2);
                        let childEvent0 = ability.actions
                            .applyDamage({
                                amount:
                                    damagePerNeighbor + (context.target === neighbors[0] ? 1 : 0),
                                damageSource: event.damageSource,
                                damageType: event.damageType,
                                damageDealtEvent: event.damageDealtEvent
                            })
                            .getEvent(neighbors[0], context.game.getFrameworkContext());
                        event.addChildEvent(childEvent0);

                        let childEvent1 = ability.actions
                            .applyDamage({
                                amount:
                                    damagePerNeighbor + (context.target === neighbors[1] ? 1 : 0),
                                damageSource: event.damageSource,
                                damageType: event.damageType,
                                damageDealtEvent: event.damageDealtEvent
                            })
                            .getEvent(neighbors[1], context.game.getFrameworkContext());
                        event.addChildEvent(childEvent1);

                        event.amount = 0;
                    }
                }))
            }
        });
    }
}

Friendship.id = 'friendship';

module.exports = Friendship;
