const Card = require('../../Card.js');

class SeabringerKekoa extends Card {
    //Taunt. (This creature's neighbors cannot be attacked unless they have taunt.)
    //Destroyed: Raise the tide.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.raiseTide()
        });
    }
}

SeabringerKekoa.id = 'seabringer-kekoa';

module.exports = SeabringerKekoa;
