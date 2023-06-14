const Card = require('../../Card.js');

class FavorOfRex extends Card {
    // Play: Trigger the play effect of a creature as if you had just played it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'any',
                cardType: 'creature',
                gameAction: ability.actions.resolveAbility({
                    ability: (ability) => ability.isPlay()
                })
            },
            effect: 'trigger play effect of {0}'
        });
    }
}

FavorOfRex.id = 'favor-of-rex';

module.exports = FavorOfRex;
