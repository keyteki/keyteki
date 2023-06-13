const Card = require('../../Card.js');

class TacticalOfficerMoon extends Card {
    // Assault 2. (Before this creature attacks, deal 2D to the attacked enemy.)
    // Play: You may rearrange the creatures in a players battleline.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's battleline do you want to rearrange",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.rearrangeBattleline((context) => ({
                player: context.select === 'Mine' ? context.player : context.player.opponent
            }))
        });
    }
}

TacticalOfficerMoon.id = 'tactical-officer-moon';

module.exports = TacticalOfficerMoon;
