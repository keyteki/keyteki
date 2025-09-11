const Card = require('../../Card.js');

class ChangeAgent extends Card {
    // After Fight/After Reap: For each card in your opponent’s hand
    // in excess of 5, they lose 1A.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            condition: (context) =>
                context.player.opponent && context.player.opponent.hand.length > 5,
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.player.opponent ? context.player.opponent.hand.length - 5 : 0
            }))
        });
    }
}

ChangeAgent.id = 'change-agent';

module.exports = ChangeAgent;
