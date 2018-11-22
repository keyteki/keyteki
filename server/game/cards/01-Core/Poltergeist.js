const Card = require('../../Card.js');

class Poltergeist extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: [
                    ability.actions.use(),
                    ability.actions.destroy()
                ]
            },
            effect: 'use {0} and destroy it'
        });
    }
}

Poltergeist.id = 'poltergeist'; // This is a guess at what the id might be - please check it!!!

module.exports = Poltergeist;
