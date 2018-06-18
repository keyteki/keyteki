const DrawCard = require('../../drawcard.js');

class BorderRider extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready this character',
            gameAction: ability.actions.ready()
        });
    }
}

BorderRider.id = 'border-rider';

module.exports = BorderRider;


