import Card from '../../Card.js';

class LegionaryTrainer extends Card {
    // Play: Make a token creature. Each friendly token creature enters play ready.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.isToken(),
            effect: ability.effects.entersPlayReady()
        });
    }
}

LegionaryTrainer.id = 'legionary-trainer';

export default LegionaryTrainer;
