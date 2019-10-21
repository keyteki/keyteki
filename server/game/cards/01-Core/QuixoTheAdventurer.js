const Card = require('../../Card.js');

class QuixoTheAdventurer extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.draw()
        });
    }
}

QuixoTheAdventurer.id = 'quixo-the-adventurer';

module.exports = QuixoTheAdventurer;
