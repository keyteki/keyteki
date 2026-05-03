const Card = require('../../Card.js');

class OlSwitcheroo extends Card {
    // Enhance capture capture.
    // Play: A friendly creature captures 1A. Give control of that creature to your opponent.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: [
                    ability.actions.capture(),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                ]
            }
        });
    }
}

OlSwitcheroo.id = 'ol--switcheroo';

module.exports = OlSwitcheroo;
