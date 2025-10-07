import Card from '../../Card.js';

class MoorWolf extends Card {
    // Skirmish.
    // Play: Ready each other Wolf creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'ready each other Wolf creature.',
            gameAction: ability.actions.ready((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.hasTrait('wolf') && card !== this
                )
            }))
        });
    }
}

MoorWolf.id = 'moor-wolf';

export default MoorWolf;
