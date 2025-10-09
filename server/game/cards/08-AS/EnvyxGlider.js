const Card = require('../../Card.js');

class EnvyxGlider extends Card {
    // After Fight: During your opponent's next turn, keys cost +1A for each friendly Mars creature in play.
    setupCardAbilities(ability) {
        this.fight({
            targetController: 'opponent',
            gameAction: ability.actions.untilEndOfOpponentNextTurn({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(
                    (player) =>
                        (player.opponent &&
                            player.opponent.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                                .length) ||
                        0
                )
            })
        });
    }
}

EnvyxGlider.id = 'envyx-glider';

module.exports = EnvyxGlider;
