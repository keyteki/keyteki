const Card = require('../../Card.js');

class Hoardgouge extends Card {
    // This creature gains, "After Fight/After Reap: If you are overwhelmed, gain 1 and deal 3 to an enemy creature."
    setupCardAbilities(ability) {
        const grantedAbility = {
            condition: (context) => context.player.isOverwhelmed(),
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            effect: 'gain 1 amber and deal 3 damage to {1}',
            gameAction: ability.actions.gainAmber()
        };

        this.whileAttached({
            effect: [
                ability.effects.gainAbility('fight', grantedAbility),
                ability.effects.gainAbility('reap', grantedAbility)
            ]
        });
    }
}

Hoardgouge.id = 'hoardgouge';

module.exports = Hoardgouge;
