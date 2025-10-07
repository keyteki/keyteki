import Card from '../../Card.js';

class TemporalPurge extends Card {
    //Play: Flip each token creature faceup. Put each non-creature card flipped this way into its owner's discard pile.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.flip((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.isToken())
            }))
        });
    }
}

TemporalPurge.id = 'temporal-purge';

export default TemporalPurge;
