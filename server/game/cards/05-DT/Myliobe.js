const Card = require('../../Card.js');

class Myliobe extends Card {
    //While the tide is high, $this gains skirmish.
    //Before Fight: Enrage the attacked creature and its neighbors.
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

module.exports = Myliobe;
