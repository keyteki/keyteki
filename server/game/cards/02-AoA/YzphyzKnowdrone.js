const Card = require('../../Card.js');

class YzphyzKnowdrone extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            },
            then: {
                target: {
                    optional: true,
                    controller: 'any',
                    activePromptTitle: 'Choose which card to purge',
                    location: 'archives',
                    gameAction: ability.actions.purge()
                },
                then: {
                    gameAction: ability.actions.stun({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to stun',
                            cardType: 'creature'
                        }
                    })
                }
            }
        });
    }
}

YzphyzKnowdrone.id = 'yzphyz-knowdrone';

module.exports = YzphyzKnowdrone;
