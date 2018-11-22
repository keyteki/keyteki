const Card = require('../../Card.js');

class NiffleQueen extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card !== this && card.hasTrait('beast'),
            effect: ability.effects.modifyPower(1)
        });

        this.persistentEffect({
            match: card => card !== this && card.hasTrait('niffle'),
            effect: ability.effects.modifyPower(1)
        });
    }
}

NiffleQueen.id = 'niffle-queen'; // This is a guess at what the id might be - please check it!!!

module.exports = NiffleQueen;
