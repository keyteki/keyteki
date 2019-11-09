const Card = require('../../Card.js');

class MoorWolf extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'ready each other Wolf creature.',
            gameAction: ability.actions.ready(context => ({
                target: context.game.creaturesInPlay.filter(card => card.hasTrait('wolf') && card !== this)
            }))
        });
    }
}

MoorWolf.id = 'moor-wolf';

module.exports = MoorWolf;
