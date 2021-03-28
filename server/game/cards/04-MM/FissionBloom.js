const Card = require('../../Card.js');

class FissionBloom extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'resolve the bonus icons of the next card played an additional time',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onResolveBonusIcons: (event) => context.player === event.context.player
                },
                multipleTrigger: false,
                gameAction: ability.actions.resolveBonusIcons((context) => ({
                    target: context.event.card
                }))
            }))
        });
    }
}

FissionBloom.id = 'fission-bloom';

module.exports = FissionBloom;
