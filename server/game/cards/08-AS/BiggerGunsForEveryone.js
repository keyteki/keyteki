import Card from '../../Card.js';

class BiggerGunsForEveryone extends Card {
    // This creature gains, ”After Fight: Deal 5D to a creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 5 })
                }
            })
        });
    }
}

BiggerGunsForEveryone.id = 'bigger-guns-for-everyone';

export default BiggerGunsForEveryone;
