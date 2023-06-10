const Card = require('../../Card.js');

class SpectralTunneler extends Card {
    // Action: Choose a creature. For the remainder of the turn, that creature is considered a flank creature and gains, Reap: Draw a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.consideredAsFlank(),
                        ability.effects.gainAbility('reap', {
                            gameAction: ability.actions.draw()
                        })
                    ]
                })
            },
            effect:
                'give {0} a reap ability and it is considered to be on a flank for the remainder of the turn'
        });
    }
}

SpectralTunneler.id = 'spectral-tunneler';

module.exports = SpectralTunneler;
