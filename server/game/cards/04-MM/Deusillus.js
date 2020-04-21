const Card = require('../../Card.js');

class Deusillus extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        // TODO This could be temporary - depends if the final JSON will contain this info or not
        // I added this to help 'It's Coming...'
        this.gigantic = true;
    }
    
    compositeParts() {
        return ['deusillus-2'];
    }
    
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => {
                return context.source.location !== 'hand' ||
                    this.compositeParts().some(id => !context.source.controller.hand.some(card => id === card.id));
            })
        });
    }
}

Deusillus.id = 'deusillus';

module.exports = Deusillus;
