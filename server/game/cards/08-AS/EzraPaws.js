import Card from '../../Card.js';

class EzraPaws extends Card {
    // Play/After Reap: Reveal your opponent’s hand. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.opponent.hand
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            }
        });
    }
}

EzraPaws.id = 'ezra-paws';

export default EzraPaws;
