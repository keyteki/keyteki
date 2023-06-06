const Card = require('../../Card.js');

class PhotonBlast extends Card {
    // Play: Deal 2 Damage icon to a creature, with 1 Damage icon
    // splash. If this damage destroys 1 or more creatures, make a
    // token creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2,
                    splash: 1
                })
            },
            then: {
                condition: (context) =>
                    context.preThenEvents.some(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ),
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
    }
}

PhotonBlast.id = 'photon-blast';

module.exports = PhotonBlast;
