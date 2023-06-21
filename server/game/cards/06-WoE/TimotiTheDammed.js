const Card = require('../../Card.js');

class TimotiTheDammed extends Card {
    // Play: Make a token creature.
    //
    // While you control a token creature, your opponent cannot forge keys.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.creaturesInPlay.some((card) => card.isToken()),
            effect: ability.effects.playerCannot('forge')
        });
    }
}

TimotiTheDammed.id = 'timoti-the-dammed';

module.exports = TimotiTheDammed;
