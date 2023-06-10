const Card = require('../../Card.js');

class BaldricTheBold extends Card {
    // Before Fight: If the creature Baldric the Bold fights is the most powerful enemy creature, gain 2A.
    setupCardAbilities(ability) {
        this.beforeFight({
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.player.opponent &&
                    context.event.card.power ===
                        Math.max(
                            ...context.player.opponent.creaturesInPlay.map((card) => card.power)
                        )
                        ? 2
                        : 0,
                target: context.player
            }))
        });
    }
}

BaldricTheBold.id = 'baldric-the-bold';

module.exports = BaldricTheBold;
