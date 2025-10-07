import Card from '../../Card.js';

class GolisArtificer extends Card {
    // After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

GolisArtificer.id = 'golis-artificer';

export default GolisArtificer;
