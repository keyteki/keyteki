import Card from '../../Card.js';

class FriendlyGuide extends Card {
    //Elusive
    //After you use one of Friendly Guide's neighbors, you may use Friendly Guide.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    context.game.activePlayer === context.source.controller &&
                    event.clone?.clonedNeighbors.includes(context.source)
            },
            optional: true,
            gameAction: ability.actions.use()
        });
    }
}

FriendlyGuide.id = 'friendly-guide';

export default FriendlyGuide;
