const Card = require('../../Card.js');

class MarshalEwer extends Card {
    //Play/Fight: Raise the tide.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            gameAction: ability.actions.raiseTide()
        });
    }
}

MarshalEwer.id = 'marshal-ewer';

module.exports = MarshalEwer;
