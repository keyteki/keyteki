const Card = require('../../Card.js');

class Ballistego extends Card {
    //Play: You may exalt Ballistego.
    //While Ballistego has A on it, it gains splash-attack 3.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.exalt()
        });
        this.persistentEffect({
            condition: (context) => context.source.amber > 0,
            effect: ability.effects.addKeyword({
                'splash-attack': 3
            })
        });
    }
}

Ballistego.id = 'ballistego';

module.exports = Ballistego;
