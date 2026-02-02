const Card = require('../../Card.js');
const { EVENTS } = require('../../Events/types');
const Event = require('../../Events/Event');

class EtherSpider extends Card {
    // Ether Spider deals no damage when fighting.
    // Each <A> that would be added to your opponent's pool is captured by Ether Spider instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onModifyAmber: (event, context) =>
                    event.player === context.player.opponent && !event.loseAmber
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                amount: 0
            })),
            then: (preThenContext) => {
                const amount = preThenContext.event.amount;

                if (amount > 0) {
                    preThenContext.source.addToken('amber', amount);

                    // Emit capture event so reactions can trigger
                    // - eg Kretchee
                    preThenContext.game.openEventWindow(
                        new Event(
                            EVENTS.onCapture,
                            {
                                context: preThenContext,
                                card: preThenContext.source,
                                amount: amount
                            },
                            () => {}
                        )
                    );
                }
            },
            effect: "capture {1} amber instead of adding it to opponent's pool",
            effectArgs: (context) => [context.event.amount]
        });

        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });
    }
}

EtherSpider.id = 'ether-spider';

module.exports = EtherSpider;
