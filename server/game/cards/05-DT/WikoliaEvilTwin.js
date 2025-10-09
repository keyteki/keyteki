const Card = require('../../Card.js');

class WikoliaEvilTwin extends Card {
    // Reap: Exalt Wikolia. Keys cost +4A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: [
                ability.actions.exalt(),
                ability.actions.untilEndOfOpponentNextTurn({
                    targetController: 'any',
                    effect: ability.effects.modifyKeyCost(4)
                })
            ],
            effect: "exalt {0} and increase key cost by 4 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent
        });
    }
}

WikoliaEvilTwin.id = 'wikolia-evil-twin';

module.exports = WikoliaEvilTwin;
