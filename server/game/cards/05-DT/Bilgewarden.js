const Card = require('../../Card.js');

class Bilgewarden extends Card {
    //Play/Reap: If the tide is high, your opponent raises the tide. Otherwise, raise the tide.>
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.raiseTide((context) => ({
                target: context.player.isTideHigh() ? context.player.opponent : context.player
            })),
            effect: "raise {1}'s tide",
            effectArgs: (context) =>
                context.player.isTideHigh() ? context.player.opponent : context.player
        });
    }
}

Bilgewarden.id = 'bilgewarden';

module.exports = Bilgewarden;
