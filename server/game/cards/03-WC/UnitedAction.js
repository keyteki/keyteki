const Card = require('../../Card.js');

class UnitedAction extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play from any house ​for which they have a card in play',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                effect: [
                    ability.effects.canPlay(card => context.game.getHousesInPlay(context.player.cardsInPlay).some(house => card.getHouses().includes(house))),
                    ability.effects.playerCannot('use')
                ]
            }))
        });
    }
}

UnitedAction.id = 'united-action';

module.exports = UnitedAction;
