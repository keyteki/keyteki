const Card = require('../../Card.js');

class LollopTheTitanic extends Card {
    // Lollop the Titanic deals no damage when attacked.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamageWhenDefending')
        });
    }
}

LollopTheTitanic.id = 'lollop-the-titanic';

module.exports = LollopTheTitanic;
