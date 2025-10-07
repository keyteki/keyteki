import Card from '../../Card.js';

class AdmirableNeophyte extends Card {
    // Play: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

AdmirableNeophyte.id = 'admirable-neophyte';

export default AdmirableNeophyte;
