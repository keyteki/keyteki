const Card = require('../../Card.js');

class RevnaStarsong extends Card {
    // Each friendly Berserker loses all fight effects.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'self',
            match: (card) => card.name === 'Berserker',
            effect: ability.effects.blankFight()
        });
    }
}

RevnaStarsong.id = 'revna-starsong';

module.exports = RevnaStarsong;
