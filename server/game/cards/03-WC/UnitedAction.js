const Card = require('../../Card.js');

class UnitedAction extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play from any house ​for which they have a card in play',
            gameAction: ability.actions.forRemainderOfTurn((context) => {
                let housesInPlay = context.game.getHousesInPlay(
                    context.game.cardsInPlay,
                    true,
                    (card) => card.owner === context.player
                );
                return {
                    effect: [
                        ability.effects.canPlay((card) =>
                            housesInPlay.some((house) => card.hasHouse(house))
                        ),
                        ability.effects.playerCannot('use')
                    ]
                };
            })
        });
    }
}

UnitedAction.id = 'united-action';

module.exports = UnitedAction;
