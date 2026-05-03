const Card = require('../../Card.js');

class BleaForh extends Card {
    // After Fight: Heal up to 2 damage from a creature. For each damage healed this way, exalt that creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                activePromptTitle: 'Choose a creature to heal',
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2, upTo: true })
            },
            preferActionPromptMessage: true,
            then: (preThenContext) => ({
                condition: (context) =>
                    (context.preThenEvents || []).some(
                        (event) => !event.cancelled && event.amount > 0
                    ),
                message: '{0} uses {1} to exalt {2} with {3} amber',
                messageArgs: (context) => [
                    (context.preThenEvents || []).reduce(
                        (sum, event) => sum + (event.cancelled ? 0 : event.amount || 0),
                        0
                    )
                ],
                gameAction: ability.actions.exalt((context) => ({
                    target: preThenContext.target,
                    amount: (context.preThenEvents || []).reduce(
                        (sum, event) => sum + (event.cancelled ? 0 : event.amount || 0),
                        0
                    )
                }))
            })
        });
    }
}

BleaForh.id = 'bleă-fŏrh';

module.exports = BleaForh;
