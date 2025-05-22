const Card = require('../../Card.js');

class UnstableDale extends Card {
    // After Reap: Deal 1 damage to each creature for each card in your hand.
    // Fate: Deal 3 damage to each friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'deal 1 damage to each creature for each card in their hand',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.player.hand.length,
                target: context.game.creaturesInPlay
            }))
        });

        this.fate({
            effect: 'deal 3 damage to each friendly creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.game.activePlayer.creaturesInPlay
            }))
        });
    }
}

UnstableDale.id = 'unstable-dale';

module.exports = UnstableDale;
