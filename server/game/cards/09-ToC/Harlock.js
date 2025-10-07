import Card from '../../Card.js';

class Harlock extends Card {
    // After Fight: If the creature Harlock fought was destroyed, make
    // a token creature.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) =>
                context.event.destroyed &&
                context.event.destroyed.includes(context.event.attackerTarget),
            gameAction: ability.actions.makeTokenCreature(),
            effect: 'make a token creature'
        });
    }
}

Harlock.id = 'harlock';

export default Harlock;
