const Card = require('../../Card.js');
const { eachNeighbor } = require('../../helpers/eachNeighbor.js');

class ProfEmeritusKering extends Card {
    // Deploy.
    // (T) Play/Fight/Reap: Use 1 of Prof. Emeritus Kering's neighbors. If the tide is high, also use Prof. Emeritus Kering's other neighbor.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            ...eachNeighbor({
                effect: 'use its neighbors',
                gameAction: (props) => ability.actions.use(props),
                secondCondition: (context) => context.player.isTideHigh()
            })
        });
    }
}

ProfEmeritusKering.id = 'prof-emeritus-kering';

module.exports = ProfEmeritusKering;
