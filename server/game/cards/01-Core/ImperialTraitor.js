const Card = require('../../Card.js');

class ImperialTraitor extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            target: {
                controller: 'opponent',
                revealTargets: true,
                location: 'hand',
                cardCondition: card => card.hasHouse('sanctum'),
                gameAction: ability.actions.purge()
            }
        });
    }
}

ImperialTraitor.id = 'imperial-traitor';

module.exports = ImperialTraitor;
