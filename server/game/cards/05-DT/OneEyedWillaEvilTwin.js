import Card from '../../Card.js';

class OneEyedWillaEvilTwin extends Card {
    // Elusive. Skirmish.
    // (T) Fight: If the tide is high, your opponent loses 2A.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

OneEyedWillaEvilTwin.id = 'one-eyed-willa-evil-twin';

export default OneEyedWillaEvilTwin;
