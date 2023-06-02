const Card = require('../../Card.js');

class Muster extends Card {
    // Play: Make a token creature. If your opponent has more A than you, archive Muster
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.opponent &&
                        context.player.opponent.amber > context.player.amber,
                    trueGameAction: ability.actions.archive()
                })
            ])
        });
    }
}

Muster.id = 'muster';

module.exports = Muster;
