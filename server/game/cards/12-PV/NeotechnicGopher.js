import Card from '../../Card.js';

class NeotechnicGopher extends Card {
    // Play/After Reap: Discard a card. If you have no cards in your hand, gain 1 amber.
    // Fate: Your opponent draws a card.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                activePromptTitle: 'Choose a card to discard',
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            effect: 'discard {1}{2}',
            effectArgs: (context) => [
                context.target ? context.target.name : 'nothing',
                context.player.hand.length <= 1 ? ' and gain 1 amber' : ''
            ],
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.hand.length === 0,
                gameAction: ability.actions.gainAmber()
            }
        });

        this.fate({
            effect: 'make their opponent draw a card',
            gameAction: ability.actions.draw((context) => ({
                target: context.game.activePlayer.opponent
            }))
        });
    }
}

NeotechnicGopher.id = 'neotechnic-gopher';

export default NeotechnicGopher;
