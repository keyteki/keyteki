import Card from '../../Card.js';

class HuggerMugger extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: Capture 1A. Then, if your opponent has more forged keys than you, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 1 }),
            then: {
                condition: (context) =>
                    context.player.opponent &&
                    context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
                message: '{0} uses {1} to steal 1 amber',
                gameAction: ability.actions.steal()
            }
        });
    }
}

HuggerMugger.id = 'hugger-mugger';

export default HuggerMugger;
