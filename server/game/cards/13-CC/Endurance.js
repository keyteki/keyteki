const Card = require('../../Card.js');

class Endurance extends Card {
    // Each of Endurance's Skyborn neighbors gain, "After Reap: Ready and fight with this creature."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                context.source.neighbors.includes(card) && card.hasHouse('skyborn'),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ]),
                effect: 'ready and fight with {0}'
            })
        });
    }
}

Endurance.id = 'endurance';

module.exports = Endurance;
