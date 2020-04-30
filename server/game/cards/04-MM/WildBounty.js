const Card = require('../../Card.js');

class WildBounty extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn(context => {
                let nextCardNotResolved = true;

                return {
                    when: {
                        onCardPlayed: event => nextCardNotResolved && event.player === context.player
                    },
                    effect: 'resolve the bonus icons of {1} an additional time',
                    effectArgs: context => context.event.card,
                    gameAction: ability.actions.resolveBonusIcons(context => {
                        nextCardNotResolved = false;

                        return {
                            target: context.event.card
                        };
                    })
                };
            })
        });
    }
}

WildBounty.id = 'wild-bounty';

module.exports = WildBounty;
