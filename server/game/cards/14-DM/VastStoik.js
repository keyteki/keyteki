const Card = require('../../Card.js');

class VastStoik extends Card {
    // Taunt.
    // After Fight: Move 1A from a creature to the common supply. If you do,
    // draw a card.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.conditional((context) => ({
                    condition: context.target && context.target.hasToken('amber'),
                    trueGameAction: ability.actions.sequential([
                        ability.actions.removeAmber({ target: context.target }),
                        ability.actions.draw({ target: context.player })
                    ])
                }))
            }
        });
    }
}

VastStoik.id = 'văst-stŏik';

module.exports = VastStoik;
