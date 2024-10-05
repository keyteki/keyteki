const Card = require('../../Card.js');

class SteppeWolf extends Card {
    // Steppe Wolf gets +1 power for each other friendly Wolf creature in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                (card, context) =>
                    context.player.creaturesInPlay.filter((c) => c != card && c.hasTrait('wolf'))
                        .length
            )
        });
    }
}

SteppeWolf.id = 'steppe-wolf';

module.exports = SteppeWolf;
