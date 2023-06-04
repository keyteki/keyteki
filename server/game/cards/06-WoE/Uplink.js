const Card = require('../../Card.js');

//  This creature gains, "Action: Make a token creature for each of this creature`s non-Star Alliance neighbors"
class Uplink extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.source.neighbors.filter(
                        (card) => !card.hasHouse('staralliance')
                    ).length
                }))
            })
        });
    }
}

Uplink.id = 'uplink';

module.exports = Uplink;
