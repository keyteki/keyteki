const Card = require('../../Card.js');

class DoorstepToHeaven extends Card {
    // Play: Each player with 6A or more is reduced to 5A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'reduce both players to 5 amber',
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount:
                        context.player.opponent && context.player.opponent.amber > 5
                            ? context.player.opponent.amber - 5
                            : 0
                })),
                ability.actions.loseAmber((context) => ({
                    target: context.player,
                    amount: context.player.amber > 5 ? context.player.amber - 5 : 0
                }))
            ]
        });
    }
}

DoorstepToHeaven.id = 'doorstep-to-heaven';

module.exports = DoorstepToHeaven;
