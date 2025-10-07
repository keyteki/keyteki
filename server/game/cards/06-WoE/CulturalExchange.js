import Card from '../../Card.js';

class CulturalExchange extends Card {
    // Play: Your opponent puts each card from their archives into their hand.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.archives.length > 0,
            effect: "return all the cards in {1}'s archives to their hand",
            effectArgs: (context) => [context.player.opponent],
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.player.opponent.archives,
                action: ability.actions.returnToHand({
                    location: ['archives']
                })
            }))
        });
    }
}

CulturalExchange.id = 'cultural-exchange';

export default CulturalExchange;
