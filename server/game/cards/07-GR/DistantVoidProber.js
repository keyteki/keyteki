const Card = require('../../Card.js');

class DistantVoidProber extends Card {
    // After Reap: If you are haunted, your opponent’s keys cost +3A during
    // their next turn.
    //
    // Scrap: An enemy creature captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isHaunted(),
            effect: "increase key cost by 3 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.untilEndOfOpponentsNextTurn({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture((context) => ({
                    player: context.player.opponent
                }))
            }
        });
    }
}

DistantVoidProber.id = 'distant-void-prober';

module.exports = DistantVoidProber;
