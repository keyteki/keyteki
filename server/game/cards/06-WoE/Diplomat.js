import Card from '../../Card.js';

class Diplomat extends Card {
    // After Reap: Each player gains 1 Aember.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'make each player gain 1 amber',
            gameAction: [
                ability.actions.gainAmber(),
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent
                }))
            ]
        });
    }
}

Diplomat.id = 'diplomat';

export default Diplomat;
