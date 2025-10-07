import Card from '../../Card.js';

class Ch337aEvilTwin extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // (T) While the tide is high, each of CH-337A's neighbors gains skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isTideHigh(),
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({
                skirmish: 1
            })
        });
    }
}

Ch337aEvilTwin.id = 'ch-337a-evil-twin';

export default Ch337aEvilTwin;
