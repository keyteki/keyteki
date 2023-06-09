const Card = require('../../Card.js');

class EtansJar extends Card {
    // Play: Name a card. Until Etans Jar leaves play, cards with that name cannot be played.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'card-name'
            },
            effect: 'prevent cards named {1} from being played',
            effectArgs: (context) => [context.cardName],
            gameAction: ability.actions.lastingEffect((context) => ({
                until: {
                    onCardMoved: (event) =>
                        event.card === context.source && event.originalLocation === 'play area'
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
