const Card = require('../../Card.js');

class FurtiveInvestors extends Card {
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
