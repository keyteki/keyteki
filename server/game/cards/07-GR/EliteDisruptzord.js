const Card = require('../../Card.js');

class EliteDisruptzord extends Card {
    // Creatures more powerful than Elite Disruptzord cannot be played.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('play', (context, effectContext) => {
                let sourcePower = context.source.power;
                // For gigantic creatures in hand, check the bottom half's power
                if (context.source.gigantic && context.source.location === 'hand') {
                    const bottomCard = context.source.giganticBottom
                        ? context.source
                        : context.source.controller.hand.find(
                              (card) => card.id === context.source.compositeId
                          );
                    if (bottomCard) {
                        sourcePower = bottomCard.printedPower;
                    }
                }
                return effectContext.source.power < sourcePower;
            })
        });
    }
}

EliteDisruptzord.id = 'elite-disruptzord';

module.exports = EliteDisruptzord;
