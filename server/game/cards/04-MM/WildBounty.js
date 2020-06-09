const Card = require('../../Card.js');

class WildBounty extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                effect: 'resolve the bonus icons of {1} an additional time',
                effectArgs: (context) => context.event.card,
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
