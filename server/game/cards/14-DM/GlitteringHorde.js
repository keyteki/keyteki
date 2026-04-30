const Card = require('../../Card.js');

class GlitteringHorde extends Card {
    // Play: For each color represented among forged keys, steal 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => {
                const colors = new Set();
                if (context.player.opponent) {
                    for (const key of ['red', 'blue', 'yellow']) {
                        if (context.player.keys[key]) {
                            colors.add(key);
                        }
                        if (context.player.opponent.keys[key]) {
                            colors.add(key);
                        }
                    }
                } else {
                    for (const key of ['red', 'blue', 'yellow']) {
                        if (context.player.keys[key]) {
                            colors.add(key);
                        }
                    }
                }
                return { amount: colors.size };
            }),
            effect: 'steal an amount of amber equal to forged key colors'
        });
    }
}

GlitteringHorde.id = 'glittering-horde';

module.exports = GlitteringHorde;
