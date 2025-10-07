import Card from '../../Card.js';

class BoNithing extends Card {
    // Play: Steal 1A for each forged key your opponent has.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent ? context.player.opponent.getForgedKeys() : 0
            }))
        });
    }
}

BoNithing.id = 'bo-nithing';

export default BoNithing;
