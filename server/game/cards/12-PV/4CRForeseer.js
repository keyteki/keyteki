import Card from '../../Card.js';

class FourCRForeseer extends Card {
    // Play/After Reap: Look at the top 2 cards of your deck. Put 1 into your hand.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            effect: 'to look at the top 2 cards of their deck',
            gameAction: ability.actions.moveCard((context) => ({
                destination: 'hand',
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to add to hand',
                    cards: context.player.deck.slice(0, 2),
                    message: '{0} adds a card to their hand'
                }
            }))
        });
    }
}

FourCRForeseer.id = '4cr-foreseer';

export default FourCRForeseer;
