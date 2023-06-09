const Card = require('../../Card.js');

class Masterplan extends Card {
    // Play: Put a card from your hand facedown beneath Masterplan.
    // Omni: Play the card beneath Masterplan. Sacrifice Masterplan.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.placeUnder((context) => ({
                    parent: context.source,
                    facedown: true
                }))
            }
        });

        this.omni({
            effect: 'play {1} and sacrifice {0}',
            effectArgs: (context) => context.source.childCards,
            gameAction: [
                ability.actions.playCard((context) => ({ target: context.source.childCards })),
                ability.actions.sacrifice()
            ]
        });
    }
}

Masterplan.id = 'masterplan';

module.exports = Masterplan;
