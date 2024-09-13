const Card = require('../../Card.js');

class TransparencyReport extends Card {
    // Play: Reveal your hand. If it contains no cards of the active
    // house, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.hand
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    !context.player.hand.some((c) => c.hasHouse(context.player.activeHouse)),
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.player,
                    amount: 2
                })),
                message: '{0} uses {1} to gain 2 amber'
            }
        });
    }
}

TransparencyReport.id = 'transparency-report';

module.exports = TransparencyReport;
