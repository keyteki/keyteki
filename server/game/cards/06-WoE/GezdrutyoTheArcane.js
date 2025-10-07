import Card from '../../Card.js';

class GezdrutyoTheArcane extends Card {
    //Action: Steal 2A. Flip Gĕzdrutyŏ the Arcane facedown (it becomes a token creature).
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.steal({ amount: 2 }),
                ability.actions.flip()
            ]),
            effect: 'Steal 2 amber and flip {0} facedown'
        });
    }
}

GezdrutyoTheArcane.id = 'gĕzdrutyŏ-the-arcane';

export default GezdrutyoTheArcane;
