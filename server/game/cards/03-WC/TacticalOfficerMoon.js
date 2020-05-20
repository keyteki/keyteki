const Card = require('../../Card.js');

class TacticalOfficerMoon extends Card {
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
