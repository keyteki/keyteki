const Card = require('../../Card.js');

class CaptainNoBeardEvilTwin extends Card {
    //Destroyed: Each of Captain No-Beard's neighbors captures 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

CaptainNoBeardEvilTwin.id = 'captain-no-beard-evil-twin';

module.exports = CaptainNoBeardEvilTwin;
