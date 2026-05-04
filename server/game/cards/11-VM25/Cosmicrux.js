const Card = require('../../Card.js');

class Cosmicrux extends Card {
    // After a player readies a creature, deal 1 to it.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReadied: (event) => event.card.type === 'creature' && event.exhausted
            },
            autoResolve: true,
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                processEvent: (event, innerContext) => {
                    event.addChildEvent(
                        ability.actions
                            .dealDamage({ amount: 1 })
                            .getEvent(event.card, innerContext.game.getFrameworkContext())
                    );
                }
            }))
        });
    }
}

Cosmicrux.id = 'cosmicrux';

module.exports = Cosmicrux;
