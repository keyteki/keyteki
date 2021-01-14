const Card = require('../../Card.js');

class HardSimpson extends Card {
    //After Hard Simpson is dealt damage, steal 1A. If the tide is low, your opponent steals 1A instead.
    // (Hard Simpson must survive this damage.)",
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => {
                    //console.log(event.card.name, context.source.name, event.card.moribund, event.card === context.source, !!event.destroyEvent);
                    return event.card === context.source && !event.card.destroyEvent;
                }
            },
            gameAction: ability.actions.steal((context) => ({
                target: context.player.isTideLow() ? context.player : context.player.opponent
            }))
        });
    }
}

HardSimpson.id = 'hard-simpson';

module.exports = HardSimpson;
