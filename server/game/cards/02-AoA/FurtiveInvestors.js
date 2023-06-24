const Card = require('../../Card.js');

class FurtiveInvestors extends Card {
    // Play: If your opponent has more A than you, gain 1A for each key your opponent has forged.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.opponent.getForgedKeys()
            }))
        });
    }
}

FurtiveInvestors.id = 'furtive-investors';

module.exports = FurtiveInvestors;
