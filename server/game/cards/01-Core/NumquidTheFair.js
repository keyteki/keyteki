const Card = require('../../Card.js');

class NumquidTheFair extends Card {
    // Play: Destroy an enemy creature. Repeat this cards effect if your opponent still controls more creatures than you.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                condition: (context) =>
                    context.player.creaturesInPlay.length <
                    context.player.opponent.creaturesInPlay.length,
                alwaysTriggers: true,
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

NumquidTheFair.id = 'numquid-the-fair';

module.exports = NumquidTheFair;
