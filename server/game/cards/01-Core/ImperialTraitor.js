const Card = require('../../Card.js');

class ImperialTraitor extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                controller: 'opponent',
                revealTargets: true,
                mode: 'upTo',
                numCards: 1,
                location: 'hand',
                selectorCondition: (selectedCards) =>
                    selectedCards.length === 0 || selectedCards[0].hasHouse('sanctum'),
                gameAction: ability.actions.purge()
            }
        });
    }
}

ImperialTraitor.id = 'imperial-traitor';

module.exports = ImperialTraitor;
