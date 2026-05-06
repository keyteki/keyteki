const GiganticCard = require('../../GiganticCard.js');

class Hydrogan extends GiganticCard {
    // (Play only with the other half of Hydrogan.)
    // Play: Put each other creature faceup under Hydrogan.
    // After Fight/After Reap: Put a creature from under Hydrogan into play under your control.
    // Destroyed: Purge each card under Hydrogan.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            gameAction: ability.actions.placeUnder((context) => ({
                parent: context.source,
                target: context.game.creaturesInPlay.filter(
                    (c) => c !== context.source && c !== context.source.composedPart
                )
            }))
        });

        this.fight({
            reap: true,
            condition: (context) => context.source.childCards.length > 0,
            target: {
                location: 'any',
                controller: 'any',
                cardType: 'creature',
                cardCondition: (card, context) => context.source.childCards.includes(card),
                gameAction: ability.actions.putIntoPlay((context) => ({
                    myControl: true,
                    target: context.target
                }))
            }
        });

        this.destroyed({
            condition: (context) => context.source.childCards.length > 0,
            gameAction: ability.actions.purge((context) => ({
                target: context.source.childCards
            })),
            effect: 'purge each card under {1} ({2})',
            effectArgs: (context) => [context.source, context.source.childCards]
        });
    }
}

Hydrogan.id = 'hydrogan';

module.exports = Hydrogan;
