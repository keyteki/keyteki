const Card = require('../../Card.js');

class OverclockedShockCollar extends Card {
    // This creature gains, “After Reap: Stun this creature and each
    // of its neighbors.”
    //
    // Scrap: Unstun each Mars creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.stun((context) => ({
                    target: context.source.neighbors.concat(context.source)
                }))
            })
        });

        this.scrap({
            gameAction: ability.actions.removeStun((context) => ({
                target: context.game.creaturesInPlay.filter((c) => c.hasHouse('mars'))
            }))
        });
    }
}

OverclockedShockCollar.id = 'overclocked-shock-collar';

module.exports = OverclockedShockCollar;
