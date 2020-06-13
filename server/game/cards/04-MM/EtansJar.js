const Card = require('../../Card.js');

class EtansJar extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'card-name',
                gameAction: ability.actions.untilEndOfMyNextTurn({
                    targetController: 'any',
                    duration: 'custom',
                    effect: ability.effects.playerCannot(
                        'play',
                        (context) => context.source.name === context.cardName
                    )
                })
            }
        });
    }
}

EtansJar.id = 'etan-s-jar';

module.exports = EtansJar;
