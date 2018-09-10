const Card = require('../../Card.js');

class GrabberJammer extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(1)
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.capture()
        });
    }
}

GrabberJammer.id = 'grabber-jammer'; // This is a guess at what the id might be - please check it!!!

module.exports = GrabberJammer;
