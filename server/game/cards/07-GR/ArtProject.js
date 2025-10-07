import Card from '../../Card.js';

class ArtProject extends Card {
    // Play: Unforge an opponent’s key. If you do, purge Art Project,
    // and your opponent draws 10 cards.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.getForgedKeys() > 0,
            gameAction: ability.actions.unforgeKey(),
            then: {
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        amount: 10
                    }))
                ]
            }
        });
    }
}

ArtProject.id = 'art-project';

export default ArtProject;
