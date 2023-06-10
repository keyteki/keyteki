const Card = require('../../Card.js');

class NiffleQueen extends Card {
    // Each other friendly Beast creature gets +1 power.
    // Each other friendly Niffle creature gets +1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasTrait('beast'),
            effect: ability.effects.modifyPower(1)
        });

        this.persistentEffect({
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasTrait('niffle'),
            effect: ability.effects.modifyPower(1)
        });
    }
}

NiffleQueen.id = 'niffle-queen';

module.exports = NiffleQueen;
