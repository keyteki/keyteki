const GiganticCard = require('../../GiganticCard.js');

class UltraGravitron extends GiganticCard {
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
