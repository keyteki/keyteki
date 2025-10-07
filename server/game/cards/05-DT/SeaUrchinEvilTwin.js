import Card from '../../Card.js';

class SeaUrchinEvilTwin extends Card {
    // (T) Play: Capture 2A. If the tide is high, steal 2A instead.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !context.player.isTideHigh(),
            gameAction: ability.actions.capture({ amount: 2 })
        });

        this.play({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

SeaUrchinEvilTwin.id = 'sea-urchin-evil-twin';

export default SeaUrchinEvilTwin;
