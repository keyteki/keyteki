const Card = require('../../Card.js');

class EmberImp extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.cardsPlayed.length > 1,
            targetController: 'opponent',
            effect: ability.effects.playerCannot('play')
        });
    }
}

EmberImp.id = 'ember-imp'; // This is a guess at what the id might be - please check it!!!

module.exports = EmberImp;
