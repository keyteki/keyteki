import Card from '../../Card.js';

class StrangeShell extends Card {
    // Strange Shell cannot fight or reap.
    //
    // Action: Put Strange Shell into your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('reap')
        });

        this.persistentEffect({
            effect: ability.effects.cardCannot('fight')
        });

        this.action({
            gameAction: ability.actions.returnToHand()
        });
    }
}

StrangeShell.id = 'strange-shell';

export default StrangeShell;
