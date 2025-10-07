import Card from '../../Card.js';

class Uplink extends Card {
    // This creature gains, Action: Make a token creature for each of this creatures nonStar Alliance neighbors.
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

export default Uplink;
