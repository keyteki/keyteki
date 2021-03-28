const Card = require('../../Card.js');

class OratorHissaro extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.ready((context) => ({
                    target: context.source.neighbors
                })),
                ability.actions.exalt((context) => ({
                    target: context.source.neighbors
                })),
                ability.actions.cardLastingEffect((context) => ({
                    effect: ability.effects.changeHouse('saurian'),
                    target: context.source.neighbors
                }))
            ],
            effect: 'ready and exalt its neighbors'
        });
    }
}

OratorHissaro.id = 'orator-hissaro';

module.exports = OratorHissaro;
