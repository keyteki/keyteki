const Card = require('../../Card.js');

class ShadowSelf extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.persistentEffect({
            match: card => this.neighbors.includes(card),
            effect: ability.effects.transferDamage(this)
        });
    }
}

ShadowSelf.id = 'shadow-self'; // This is a guess at what the id might be - please check it!!!

module.exports = ShadowSelf;
