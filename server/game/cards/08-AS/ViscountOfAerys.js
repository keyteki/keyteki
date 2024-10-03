const Card = require('../../Card.js');

class ViscountOfAerys extends Card {
    // While your yellow key is forged, each enemy creature enters play stunned.
    // Play: If your yellow key is forged, stun each enemy creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.keys.yellow,
            targetLocation: 'any',
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.entersPlayStunned()
        });

        this.play({
            condition: (context) => context.player.keys.yellow && context.player.opponent,
            gameAction: ability.actions.stun((context) => ({
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

ViscountOfAerys.id = 'viscount-of-aerys';

module.exports = ViscountOfAerys;
