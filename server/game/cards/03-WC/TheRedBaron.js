const Card = require('../../Card.js');

class TheRedBaron extends Card {
    // While your red key is forged, The Red Baron gains, Reap: Steal 1A.
    // While your opponents red key is forged, The Red Baron gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source && card.controller.keys.red,
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.steal()
            })
        });

        this.persistentEffect({
            match: (card, context) =>
                card === context.source &&
                card.controller.opponent &&
                card.controller.opponent.keys.red,
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

TheRedBaron.id = 'the-red-baron';

module.exports = TheRedBaron;
