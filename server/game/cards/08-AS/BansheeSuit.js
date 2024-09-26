const Card = require('../../Card.js');

class BansheeSuit extends Card {
    // This creature gains, “Destroyed: Archive this creature and the
    // top 2 cards of your discard pile.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.archive((context) => ({
                    target: context.source.controller.discard.slice(0, 2).concat([context.source])
                }))
            })
        });
    }
}

BansheeSuit.id = 'banshee-suit';

module.exports = BansheeSuit;
