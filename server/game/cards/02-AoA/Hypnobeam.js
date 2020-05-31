const Card = require('../../Card.js');

class Hypnobeam extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            }
        });
    }
}

Hypnobeam.id = 'hypnobeam';

module.exports = Hypnobeam;
