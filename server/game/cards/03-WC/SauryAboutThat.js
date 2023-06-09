const Card = require('../../Card.js');

class SauryAboutThat extends Card {
    // Play: Destroy a creature. Its controller gains 1.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy {0} and have {1} gaining 1 amber',
            effectArgs: (context) => [context.target.controller],
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.destroy(),
                    ability.actions.gainAmber((context) => ({
                        target: context.target ? context.target.controller : []
                    }))
                ]
            }
        });
    }
}

SauryAboutThat.id = 'saury-about-that';

module.exports = SauryAboutThat;
