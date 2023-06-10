const Card = require('../../Card.js');

class ImperialTraitor extends Card {
    // Play: Look at your opponents hand. You may choose and purge a Sanctum card in it.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                controller: 'opponent',
                revealTargets: true,
                mode: 'upTo',
                numCards: 1,
                location: 'hand',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.purge()
            }
        });
    }
}

ImperialTraitor.id = 'imperial-traitor';

module.exports = ImperialTraitor;
