const Card = require('../../Card.js');

class LollopTheTitanic extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamageWhenDefending')
        });
    }
}

LollopTheTitanic.id = 'lollop-the-titanic';

module.exports = LollopTheTitanic;
