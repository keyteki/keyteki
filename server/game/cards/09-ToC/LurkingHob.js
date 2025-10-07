import Card from '../../Card.js';

class LurkingHob extends Card {
    // After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

LurkingHob.id = 'lurking-hob';

export default LurkingHob;
