const Card = require('../../Card.js');

class BrutalConsequences extends Card {
    // Play: Deal 3 to a creature. If this damage destroys that creature, purge it.
    // Fate: Purge an exhausted friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: (preThenContext) => ({
                condition: (context) => {
                    let dealDamageEvent = context.preThenEvents.find(
                        (event) => event.card === preThenContext.target
                    );
                    return (
                        dealDamageEvent.destroyEvent &&
                        dealDamageEvent.destroyEvent.destroyedByDamageDealt &&
                        dealDamageEvent.destroyEvent.resolved &&
                        dealDamageEvent.card.location === 'discard'
                    );
                },
                gameAction: ability.actions.purge({ target: preThenContext.target }),
                message: '{0} uses {1} to purge {3}',
                messageArgs: () => [preThenContext.target]
            })
        });

        this.fate({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.purge()
            }
        });
    }
}

BrutalConsequences.id = 'brutal-consequences';

module.exports = BrutalConsequences;
