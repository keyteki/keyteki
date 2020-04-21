const Card = require('../../Card.js');

class Deusillus extends Card {
    
    playWithId() {
        return 'deusillus-2';
    }
    
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.playWith(this.playWithId())
        });
    }
}

Deusillus.id = 'deusillus';

module.exports = Deusillus;
