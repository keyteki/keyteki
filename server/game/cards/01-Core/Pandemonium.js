const Card = require('../../Card.js');

class Pandemonium extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each undamaged creature to capture 1 amber from their opponent',
            gameAction: ability.actions.capture(context => ({ target: context.game.creaturesInPlay.filter(card => !card.hasToken('damage')) }))
        });
    }
}

Pandemonium.id = 'pandemonium'; // This is a guess at what the id might be - please check it!!!

module.exports = Pandemonium;
