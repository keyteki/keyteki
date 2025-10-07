import Card from '../../Card.js';

class Omnipus extends Card {
    // Omnipus cannot fight.
    // Play: Discard the top 8 cards of your deck. Play each Tentaclid from your discard pile, one at a time.
    // Reap: Gain 1A for each friendly Tentaclid.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('fight')
        });

        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 8)
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.discard.some((card) => card.id === 'tentaclid'),
                gameAction: ability.actions.sequentialForEach((context) => ({
                    forEach: context.player.discard.filter((card) => card.id === 'tentaclid'),
                    action: ability.actions.playCard()
                }))
            }
        });

        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter((card) => card.id === 'tentaclid')
                    .length
            }))
        });
    }
}

Omnipus.id = 'omnipus';

export default Omnipus;
