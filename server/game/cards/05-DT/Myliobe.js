import Card from '../../Card.js';

class Myliobe extends Card {
    // (T) While the tide is high, Myliobe gains skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Before Fight: Enrage the creature Myliobe fights and each of that creature’s neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.addKeyword({
                skirmish: 1
            })
        });
        this.beforeFight({
            gameAction: ability.actions.enrage((context) => ({
                target: context.event.card.neighbors.concat(context.event.card)
            }))
        });
    }
}

Myliobe.id = 'myliobe';

export default Myliobe;
