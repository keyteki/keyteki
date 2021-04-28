const Card = require('../../Card.js');

class NiffleQueen extends Card {
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
