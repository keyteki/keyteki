import Card from '../../Card.js';

class FlashFreeze extends Card {
    // Play: For the remainder of the turn, after you play another card, exhaust a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                preferActionPromptMessage: true,
                gameAction: ability.actions.exhaust({
                    promptForSelect: {
                        cardType: 'creature',
                        message: '{0} uses {1} to exhaust {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })
            }))
        });
    }
}

FlashFreeze.id = 'flash-freeze';

export default FlashFreeze;
