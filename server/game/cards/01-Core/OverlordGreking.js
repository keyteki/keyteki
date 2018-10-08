const Card = require('../../Card.js');

class OverlordGreking extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.event.card,
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }
}

OverlordGreking.id = 'overlord-greking'; // This is a guess at what the id might be - please check it!!!

module.exports = OverlordGreking;
