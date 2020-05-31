const Card = require('../../Card.js');

class TheCallipygianIdeal extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({ target: context.source.parent }))
        });

        this.whileAttached({
            effect: ability.effects.keyAmber()
        });
    }
}

TheCallipygianIdeal.id = 'the-callipygian-ideal';

module.exports = TheCallipygianIdeal;
