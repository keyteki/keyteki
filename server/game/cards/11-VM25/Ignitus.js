import Card from '../../Card.js';

class Ignitus extends Card {
    // Ignitus gains splash-attack X, where X is the number of exhausted creatures
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword((_, context) => ({
                'splash-attack': context.game.creaturesInPlay.filter((c) => c.exhausted).length
            }))
        });
    }
}

Ignitus.id = 'ignitus';

export default Ignitus;
