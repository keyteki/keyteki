const Card = require('../../Card.js');

class SauryAboutThat extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy {0} and have {1} gaining 1 amber',
            effectArgs: context => [context.target.controller],
            target: {
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: preThenContext => ({
                gameAction: ability.actions.gainAmber(ability.actions.gainAmber({
                    target: preThenContext.target.controller
                }))
            })
        });
    }
}

SauryAboutThat.id = 'saury-about-that';

module.exports = SauryAboutThat;
