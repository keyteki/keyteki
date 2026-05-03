const Card = require('../../Card.js');

class GlitteringHorde extends Card {
    // Play: For each color represented among forged keys, steal 1A.
    setupCardAbilities(ability) {
        const keyColors = (context) =>
            context.game.getPlayers().reduce((colors, player) => {
                for (const key of ['red', 'blue', 'yellow']) {
                    if (player.keys[key]) {
                        colors.add(key);
                    }
                }
                return colors;
            }, new Set());
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: keyColors(context).size
            })),
            effect: '{1}',
            effectArgs: (context) => {
                const colors = Array.from(keyColors(context));
                if (colors.length === 0) {
                    return ['steal 0 amber'];
                }
                const list =
                    colors.length === 1
                        ? colors[0]
                        : colors.length === 2
                        ? colors.join(' and ')
                        : colors.slice(0, -1).join(', ') + ', and ' + colors[colors.length - 1];
                return [
                    `steal ${colors.length} amber due to the ${list} forged key${
                        colors.length === 1 ? '' : 's'
                    }`
                ];
            }
        });
    }
}

GlitteringHorde.id = 'glittering-horde';

module.exports = GlitteringHorde;
