import Card from '../../Card.js';

class Mk2Generator extends Card {
    //Reap: Mk.2 Generator enter play ready. Action: Make a token creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });

        this.action({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

Mk2Generator.id = 'mk2-generator';

export default Mk2Generator;
