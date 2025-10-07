import Card from '../../Card.js';

class UnityPrism extends Card {
    // Alpha.
    // Play: For the remainder of the turn, you may play cards from any house.
    // You cannot play more than 4 cards this turn (including this one).
    // Scrap: Reveal your hand. Gain 1 amber for each house represented in it.
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow playing up to 4 cards from any house this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: [
                    ability.effects.canPlay((context) => {
                        return context.game.cardsPlayedThisPhase.length < 4;
                    }),
                    ability.effects.playerCannot('play', (context) => {
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
                context.player.hand.reduce((houses, card) => {
                    if (!houses.includes(card.printedHouse)) {
                        houses.push(card.printedHouse);
                    }
                    return houses;
                }, []).length
            ],
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.game.getHousesInPlay(context.player.hand).length
            }))
        });
    }
}

UnityPrism.id = 'unity-prism';

export default UnityPrism;
