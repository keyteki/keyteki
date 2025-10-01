const Card = require('../../Card.js');

class UnityPrism extends Card {
    // Alpha.
    // Play: For the remainder of the turn, you may play cards from any house.
    // You cannot play more than 4 cards this turn (including this one).
    // Scrap: Reveal your hand. Gain 1 amber for each house represented in it.
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow playing cards from any house and limit to 4 cards this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: [
                    ability.effects.canPlay((card, context) => {
                        return context.game.cardsPlayedThisPhase.length < 4;
                    }),
                    ability.effects.playerCannot('play', (card, context) => {
                        return context.game.cardsPlayedThisPhase.length >= 4;
                    })
                ]
            })
        });

        this.scrap({
            effect:
                'reveal their hand ({1}) and gain 1 amber for each house represented in it, gaining a total of {2} amber',
            effectArgs: (context) => [
                context.player.hand,
                context.game.getHousesInPlay(context.player.hand).length
            ],
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.game.getHousesInPlay(context.player.hand).length
            }))
        });
    }
}

UnityPrism.id = 'unity-prism';

module.exports = UnityPrism;
