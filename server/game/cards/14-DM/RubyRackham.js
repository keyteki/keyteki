const Card = require('../../Card.js');

class RubyRackham extends Card {
    // After Fight: If a red key is forged, deal 4 damage to each enemy flank creature. Otherwise, deal 1 damage to each enemy flank creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.game.isKeyForged('red') ? 4 : 1,
                target: context.player.opponent
                    ? context.player.opponent.creaturesInPlay.filter((card) => card.isOnFlank())
                    : []
            }))
        });
    }
}

RubyRackham.id = 'ruby-rackham';

module.exports = RubyRackham;
