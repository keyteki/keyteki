const Card = require('../../Card.js');

class PsychicHaze extends Card {
    // Enraged creatures cannot be used to fight friendly Mars creatures.
    //
    // Action: Enrage each enemy creature.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.enrage((context) => ({
                target: context.player.opponent.creaturesInPlay
            }))
        });

        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.hasHouse('mars'),
            effect: ability.effects.cardCannot('attack', (context) => context.source.enraged)
        });
    }
}

PsychicHaze.id = 'psychic-haze';

module.exports = PsychicHaze;
