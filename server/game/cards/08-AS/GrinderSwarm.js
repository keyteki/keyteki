import Card from '../../Card.js';

class GrinderSwarm extends Card {
    // Grinder Swarm gets +1 power for each creature in play.
    // After Fight: Capture 2A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((_, context) => context.game.creaturesInPlay.length)
        });
        this.fight({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

GrinderSwarm.id = 'grinder-swarm';

export default GrinderSwarm;
