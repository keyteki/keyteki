import Card from '../../Card.js';

class TheTwinLamps extends Card {
    // Play: Steal 1A. If you have more A in your pool than your
    // opponent, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent && context.player.amber > context.player.opponent.amber,
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
    }
}

TheTwinLamps.id = 'the-twin-lamps';

export default TheTwinLamps;
