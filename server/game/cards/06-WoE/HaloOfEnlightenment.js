const Card = require('../../Card.js');

class HaloOfEnlightenment extends Card {
    setupCardAbilities(ability) {
        // Play: Make a token creature
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        // This creature cannot be attacked while its controller controls a token creature
        this.whileAttached({
            effect: ability.effects.cardCannot('attack', (context) => {
                return (
                    context.source.controller.opponent &&
                    context.source.controller.opponent.creaturesInPlay.some((card) =>
                        card.isToken()
                    )
                );
            })
        });
    }
}

HaloOfEnlightenment.id = 'halo-of-enlightenment';

module.exports = HaloOfEnlightenment;
