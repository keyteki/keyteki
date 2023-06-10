const GiganticCard = require('../../GiganticCard.js');

class UltraGravitron extends GiganticCard {
    // (Play only with the other half of Ultra Gravitron.)
    // Play: Archive the top 5 cards of your deck.
    // Fight/Reap: Discard a card from your archives. If you do, purge a creature and resolve each of its bonus icons as if you had played it.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            gameAction: ability.actions.archive((context) => ({
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
                    cardType: 'creature',
                    location: 'play area',
                    gameAction: [ability.actions.purge(), ability.actions.resolveBonusIcons()]
                }
            }
        });
    }
}

UltraGravitron.id = 'ultra-gravitron';

module.exports = UltraGravitron;
