const Card = require('../../Card.js');

class NagooYani extends Card {
    // Play/After Fight: Deal 4D to an enemy creature.
    // Scrap: Deal 2D to each enemy flank creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });

        this.scrap({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.creaturesInPlay.filter((card) => card.isOnFlank()),
                amount: 2
            }))
        });
    }
}

NagooYani.id = 'nagoo-yani';

module.exports = NagooYani;
