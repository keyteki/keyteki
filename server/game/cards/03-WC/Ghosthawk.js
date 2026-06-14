const Card = require('../../Card.js');
const { eachNeighbor } = require('../../helpers/eachNeighbor.js');

class Ghosthawk extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play: You may reap with each neighboring creature, one at a time.
    setupCardAbilities(ability) {
        this.play(
            eachNeighbor({
                effect: 'reap with each of its neighbors in turn',
                optional: true,
                gameAction: (props) => ability.actions.reap(props)
            })
        );
    }
}

Ghosthawk.id = 'ghosthawk';

module.exports = Ghosthawk;
