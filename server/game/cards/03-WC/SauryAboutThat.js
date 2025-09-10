const Card = require('../../Card.js');

class SauryAboutThat extends Card {
    // Play: Destroy a creature. Its controller gains 1.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy {0}',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.destroy(),
                    ability.actions.gainAmber((context) => ({
                        target: context.target ? context.target.controller : []
                    }))
                ])
            },
            then: (preThenContext) => ({
                message: '{3} gains 1 amber',
                messageArgs: () => [preThenContext.target.controller]
            })
        });
    }
}

SauryAboutThat.id = 'saury-about-that';

module.exports = SauryAboutThat;
