const Card = require('../../Card.js');

class ClawcloakSwipe extends Card {
    // Play: If you are overwhelmed, choose a friendly creature.
    // For each creature your opponent controls in excess of you, the chosen creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.isOverwhelmed(),
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture((context) => ({
                    amount:
                        context.player.opponent.creaturesInPlay.length -
                        context.player.creaturesInPlay.length
                }))
            },
            effect: 'capture {1} amber on {2}',
            effectArgs: (context) => [
                context.player.opponent.creaturesInPlay.length -
                    context.player.creaturesInPlay.length,
                context.target
            ]
        });
    }
}

ClawcloakSwipe.id = 'clawcloak-swipe';

module.exports = ClawcloakSwipe;
