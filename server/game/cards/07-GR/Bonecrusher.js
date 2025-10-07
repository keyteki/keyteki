import Card from '../../Card.js';

class Bonecrusher extends Card {
    // This creature gains, “Action: Destroy a creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.destroy()
                }
            })
        });
    }
}

Bonecrusher.id = 'bonecrusher';

export default Bonecrusher;
