const Card = require('../../Card.js');

class Pentacorder extends Card {
    // This creature gains, “Your opponent's keys cost +1A for each
    // house represented among friendly creatures.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(
                    (_, context) =>
                        context.game.getHousesInPlay(context.source.controller.creaturesInPlay)
                            .length
                )
            })
        });
    }
}

Pentacorder.id = 'pentacorder';

module.exports = Pentacorder;
