const Card = require('../../Card.js');

class QuixoTheAdventurer extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.draw()
        });
    }
}

QuixoTheAdventurer.id = 'quixo-the-adventurer'; // This is a guess at what the id might be - please check it!!!

module.exports = QuixoTheAdventurer;
