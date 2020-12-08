const Card = require('../../Card.js');

class WildBounty extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                message: '{0} uses {1} to resolve the bonus icons of {2} an additional time',
                messageArgs: (context) => [context.player, context.source, context.event.card],
                multipleTrigger: false,
                gameAction: ability.actions.resolveBonusIcons((context) => ({
                    target: context.event.card
                }))
            }))
        });
    }
}

WildBounty.id = 'wild-bounty';

module.exports = WildBounty;
