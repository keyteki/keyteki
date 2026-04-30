const Card = require('../../Card.js');

class FiatTranscoder extends Card {
    // Action: Lose 1A. If you do, take control of an enemy creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    }))
                },
                effect: 'take control of {0}'
            }
        });
    }
}

FiatTranscoder.id = 'fiat-transcoder';

module.exports = FiatTranscoder;
