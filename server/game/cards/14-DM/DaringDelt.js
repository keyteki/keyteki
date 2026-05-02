const Card = require('../../Card.js');

class DaringDelt extends Card {
    // After Fight: Gain 1 for each ready friendly creature of the active house.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) =>
                        !card.exhausted &&
                        context.player.activeHouse &&
                        card.hasHouse(context.player.activeHouse)
                ).length
            }))
        });
    }
}

DaringDelt.id = 'daring-delt';

module.exports = DaringDelt;
