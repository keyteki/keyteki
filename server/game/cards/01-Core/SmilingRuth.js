const Card = require('../../Card.js');

class SmilingRuth extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: If you forged a key this turn, take control of an enemy flank creature.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.keysForgedThisRound.length > 0,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }
}

SmilingRuth.id = 'smiling-ruth';

module.exports = SmilingRuth;
