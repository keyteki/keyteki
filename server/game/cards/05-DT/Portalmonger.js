import Card from '../../Card.js';

class Portalmonger extends Card {
    // (T) While the tide is high, your opponent’s keys cost +4A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyKeyCost(4)
        });
    }
}

Portalmonger.id = 'portalmonger';

export default Portalmonger;
