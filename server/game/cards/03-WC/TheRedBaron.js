const Card = require('../../Card.js');

class TheRedBaron extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === this && card.controller.keys.red,
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.steal()
            })
        });
        this.persistentEffect({
            match: (card) =>
                card === this && card.controller.opponent && card.controller.opponent.keys.red,
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

TheRedBaron.id = 'the-red-baron';

module.exports = TheRedBaron;
