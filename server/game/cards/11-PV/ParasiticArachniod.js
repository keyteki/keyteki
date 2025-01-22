const Card = require('../../Card.js');

class ParasiticArachniod extends Card {
    // Destroyed: An enemy creature captures 1 Aember icon from its own side.
    // Fate: A friendly creature captures 3 Aember icon from your side.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: 1,
                    player: context.source.controller.opponent
                }))
            }
        });

        this.fate({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: 3,
                    player: context.game.activePlayer
                }))
            }
        });
    }
}

ParasiticArachniod.id = 'parasitic-arachniod';

module.exports = ParasiticArachniod;
