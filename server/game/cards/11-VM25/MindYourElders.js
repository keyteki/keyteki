const Card = require('../../Card.js');

class MindYourElders extends Card {
    // Play: If there are more friendly Mars creatures than enemy Mars creatures, a friendly creature captures 3.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => {
                const friendlyMarsCreatures = context.player.creaturesInPlay.filter((card) =>
                    card.hasHouse('mars')
                );
                const enemyMarsCreatures = context.player.opponent.creaturesInPlay.filter((card) =>
                    card.hasHouse('mars')
                );
                return friendlyMarsCreatures.length > enemyMarsCreatures.length;
            },
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture({ amount: 3 })
            }
        });
    }
}

MindYourElders.id = 'mind-your-elders';

module.exports = MindYourElders;
