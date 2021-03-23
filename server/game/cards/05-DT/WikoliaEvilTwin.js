const Card = require('../../Card.js');

class WikoliaEvilTwin extends Card {
    //Reap: Exalt $this. Your opponent’s keys cost +4A during their next turn.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.lastingEffect({
                    targetController: 'opponent',
                    effect: ability.effects.modifyKeyCost(4)
                }),
                message: "{1} increases {3}'s key cost by 4 until the end of their next turn",
                messageArgs: (context) => context.player.opponent
            }
        });
    }
}

WikoliaEvilTwin.id = 'wikolia-evil-twin';

module.exports = WikoliaEvilTwin;
