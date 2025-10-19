const Card = require('../../Card.js');

class UnitedAction extends Card {
    // Alpha.
    // Play: For the remainder of the turn, you may play cards from any house for which you have a card in play. You cannot use cards this turn.
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play from any house ​for which they have a card in play',
            gameAction: ability.actions.untilPlayerTurnEnd({
                effect: [
                    ability.effects.canPlay((card, context) => {
                        let housesInPlay = context.game.getHousesInPlay(
                            context.game.cardsInPlay,
                            true,
                            (card) => card.controller === context.player
                        );
                        return housesInPlay.some((house) => card.hasHouse(house));
                    }),
                    ability.effects.playerCannot('use')
                ]
            })
        });
    }
}

UnitedAction.id = 'united-action';

module.exports = UnitedAction;
