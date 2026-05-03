const Card = require('../../Card.js');

class GlitteringHorde extends Card {
    // Play: For each color represented among forged keys, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => {
                const colors = context.game.getPlayers().reduce((colors, player) => {
                    for (const key of ['red', 'blue', 'yellow']) {
                        if (player.keys[key]) {
                            colors.add(key);
                        }
                    }
                    return colors;
                }, new Set());
                return { amount: colors.size };
            }),
            effect: 'steal an amount of amber equal to forged key colors'
        });
    }
}

GlitteringHorde.id = 'glittering-horde';

module.exports = GlitteringHorde;
