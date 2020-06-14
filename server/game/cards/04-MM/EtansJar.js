const Card = require('../../Card.js');

class EtansJar extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'card-name'
            },
            gameAction: ability.actions.lastingEffect((context) => ({
                until: {
                    onCardLeavesPlay: (event) => event.card === context.source
                },
                targetController: 'any',
                effect: ability.effects.playerCannot(
                    'play',
                    (innerContext) => innerContext.source.name === context.cardName
                )
            }))
        });
    }
}

EtansJar.id = 'etan-s-jar';

module.exports = EtansJar;
