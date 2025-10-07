import Card from '../../Card.js';

class PiSwevenEvilTwin extends Card {
    // (T) Reap: If the tide is high, your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

PiSwevenEvilTwin.id = 'pi-sweven-evil-twin';

export default PiSwevenEvilTwin;
