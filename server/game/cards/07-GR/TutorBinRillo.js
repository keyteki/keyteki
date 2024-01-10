const Card = require('../../Card.js');

class TutorBinRillo extends Card {
    // Play: Discard up to 3 cards. Your opponent draws a card.
    //
    // Scrap: Each player draws a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                mode: 'upTo',
                location: 'hand',
                numCards: 3,
                gameAction: ability.actions.discard()
            },
            then: {
                alwaysTriggers: 'true',
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.draw((context) => ({
                    target: context.player.opponent
                }))
            }
        });

        this.scrap({
            gameAction: ability.actions.draw((context) => ({
                target: [context.player].concat(
                    context.player.opponent ? [context.player.opponent] : []
                )
            }))
        });
    }
}

TutorBinRillo.id = 'tutor-bin-rillo';

module.exports = TutorBinRillo;
