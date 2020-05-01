const Card = require('../../Card.js');

class UltraGraviton extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.gigantic = true;
        this.playedParts = [];
        this.compositeImageId = 'ultra-graviton-complete';
        this.compositeParts = ['ultra-graviton-2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => {
                return context.source.location !== 'hand' ||
                    this.compositeParts.some(id => !context.source.controller.hand.some(card => id === card.id));
            })
        });

        this.play({
            gameAction: ability.actions.archive(context => ({
                target: context.player.deck.slice(0, 5)
            }))
        });

        this.fight({
            reap: true,
            target: {
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    location: 'play area',
                    gameAction: [
                        ability.actions.purge(),
                        ability.actions.resolveBonusIcons()
                    ]
                }
            }
        });
    }
}

UltraGraviton.id = 'ultra-graviton';

module.exports = UltraGraviton;
