import Card from '../../Card.js';

class Stunner extends Card {
    // This creature gains, "Fight/Reap: You may stun a creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                fight: true,
                target: {
                    optional: true,
                    numCards: 1,
                    cardType: ['creature'],
                    gameAction: ability.actions.stun()
                }
            })
        });
    }
}

Stunner.id = 'stunner';

export default Stunner;
