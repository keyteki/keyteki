const Card = require('../../Card.js');

class GrumpBuggy extends Card {
    // Your opponents keys cost +1A for each friendly creature with power 5or higher.
    // Your keys cost +1A for each enemy creature with power 5or higher.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                () =>
                    this.controller.cardsInPlay.filter(
                        (card) => card.type === 'creature' && card.power >= 5
                    ).length
            )
        });
        this.persistentEffect({
            condition: (context) => !!context.player.opponent,
            effect: ability.effects.modifyKeyCost(
                () =>
                    this.controller.opponent.cardsInPlay.filter(
                        (card) => card.type === 'creature' && card.power >= 5
                    ).length
            )
        });
    }
}

GrumpBuggy.id = 'grump-buggy';

module.exports = GrumpBuggy;
