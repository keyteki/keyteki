import Card from '../../Card.js';

class Wrangler extends Card {
    // Action: Each player gains 1A.
    setupCardAbilities(ability) {
        this.action({
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

Wrangler.id = 'wrangler';

export default Wrangler;
