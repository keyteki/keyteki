const Card = require('../../Card.js');

class Warrior extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card === context.source &&
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length > 0,
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Warrior.id = 'warrior';

module.exports = Warrior;
