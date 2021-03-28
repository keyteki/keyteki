const Card = require('../../Card.js');

class Poltergeist extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.sequential([
                    ability.actions.use(),
                    ability.actions.destroy()
                ])
            },
            effect: 'use {0} and destroy it'
        });
    }
}

Poltergeist.id = 'poltergeist';

module.exports = Poltergeist;
