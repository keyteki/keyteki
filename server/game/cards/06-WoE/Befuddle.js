const Card = require('../../Card.js');

class Befuddle extends Card {
    //Play: Choose a house on your opponent's identity card. During their next turn, they cannot play cards of other houses.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: (context) => context.player.opponent.houses
            },
            effect: 'stop {1} from playing cards of houses other than {2}',
            effectArgs: (context) => [context.player.opponent, context.house],
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                effect: ability.effects.playerCannot(
                    'play',
                    (sourceContext) =>
                        // When an in-play source plays another card, for
                        // some reason the play restriction is still
                        // checked on that card, even though it's already
                        // in play.  So ignore those restriction checks
                        // for cards already in play.
                        sourceContext.source.location !== 'play area' &&
                        // A card can't be played if it has any house that's not the called house.
                        sourceContext.source.hasHouseThatIsNot(context.house)
                )
            }))
        });
    }
}

Befuddle.id = 'befuddle';

module.exports = Befuddle;
