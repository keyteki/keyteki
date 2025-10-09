const Card = require('../../Card.js');

class CrushingDeep extends Card {
    //Play: During your opponent's next turn, keys cost +3A for each forged key they have.
    setupCardAbilities(ability) {
        this.play({
            effect: "increase key cost by 3 for each forged key they have during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.untilEndOfOpponentNextTurn({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost((player, context) =>
                    context.player.opponent ? context.player.opponent.getForgedKeys() * 3 : 0
                )
            })
        });
    }
}

CrushingDeep.id = 'crushing-deep';

module.exports = CrushingDeep;
