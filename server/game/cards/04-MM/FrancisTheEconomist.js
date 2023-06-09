const Card = require('../../Card.js');

class FrancisTheEconomist extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: Each player gains 1.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    condition: !!context.player.opponent,
                    target: context.player.opponent,
                    amount: 1
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player,
                    amount: 1
                }))
            ]
        });
    }
}

FrancisTheEconomist.id = 'francis-the-economist';

module.exports = FrancisTheEconomist;
