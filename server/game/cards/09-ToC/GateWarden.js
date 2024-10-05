const Card = require('../../Card.js');

class GateWarden extends Card {
    // While you control a token creature, enemy creatures cannot
    // reap.
    //
    // Play: Make a token creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.creaturesInPlay.some((card) => card.isToken()),
            match: (card) => card.type === 'creature',
            effect: ability.effects.cardCannot('reap')
        });

        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

GateWarden.id = 'gate-warden';

module.exports = GateWarden;
