const DrawCard = require('../../../drawcard.js');

class MaesterLuwin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Robb Stark',
            effect: ability.effects.addKeyword('Insight')
        });

        this.persistentEffect({
            match: (card) => card.name === 'Jon Snow',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.persistentEffect({
            match: (card) => card.name === 'Bran Stark',
            effect: ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'plot')
        });

        this.persistentEffect({
            match: (card) => card.name === 'Rickon Stark',
            effect: ability.effects.addKeyword('Pillage')
        });
    }
}

MaesterLuwin.code = '02003';

module.exports = MaesterLuwin;
