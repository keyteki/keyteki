import Card from '../../Card.js';

class Akugyo extends Card {
    // Each A that would be added to your opponent’s pool is captured
    // by Akugyo instead.
    // After Fight: Move 2A from Akugyo to your pool.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onModifyAmber: (event, context) =>
                    event.player === context.player.opponent && !event.loseAmber
            },
            gameAction: ability.actions.sequential([
                ability.actions.placeAmber((context) => ({
                    target: context.source,
                    amount: context.event.amount
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    amount: 0
                }))
            ]),
            effect: "capture amber instead of adding it to opponent's pool"
        });

        this.fight({
            condition: (context) => context.source.amber > 0,
            effect: 'move {1} amber from {0} to their pool',
            effectArgs: (context) => [context.source.amber > 1 ? 2 : context.source.amber],
            gameAction: ability.actions.removeAmber({ amount: 2 }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

Akugyo.id = 'akugyo';

export default Akugyo;
