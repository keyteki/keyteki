import Card from '../../Card.js';
import _ from 'underscore';

class Malstrom extends Card {
    // Play: Put each creature on top of its owner's deck in a random order. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: "randomly put each creature on top of its owner's deck and gain 2 chains",
            gameAction: ability.actions.sequential([
                ability.actions.returnToDeck((context) => ({
                    target: _.shuffle(context.game.creaturesInPlay)
                })),
                ability.actions.gainChains({ amount: 2 })
            ])
        });
    }
}

Malstrom.id = 'mælstrom';

export default Malstrom;
