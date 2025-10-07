import Card from '../../Card.js';

class DinosaursBane extends Card {
    // Play: Destroy a Dinosaur creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('dinosaur')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('dinosaur'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

DinosaursBane.id = 'dinosaurs--bane';

export default DinosaursBane;
