import Card from '../../Card.js';

class Darklamp extends Card {
    // Each friendly creature with A on it gains elusive.
    //
    // Play: Capture 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.amber,
            effect: ability.effects.addKeyword({ elusive: 1 })
        });

        this.play({
            gameAction: ability.actions.capture()
        });
    }
}

Darklamp.id = 'darklamp';

export default Darklamp;
