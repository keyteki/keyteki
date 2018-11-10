const Card = require('../../Card.js');

class OverlordGreking extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.putIntoPlay(context => ({
                target: context.event.card,
                myControl: true
            }))
        });
    }
}

OverlordGreking.id = 'overlord-greking'; // This is a guess at what the id might be - please check it!!!

module.exports = OverlordGreking;
