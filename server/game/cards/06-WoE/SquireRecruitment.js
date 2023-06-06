const Card = require('../../Card.js');

class SquireRecruitment extends Card {
    // Play: Make a token creature for each friendly Knight creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make a token creature for each friendly Knight creature',
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.creaturesInPlay.filter((card) => card.hasTrait('knight'))
                    .length,
                action: ability.actions.makeTokenCreature()
            }))
        });
    }
}

SquireRecruitment.id = 'squire-recruitment';

module.exports = SquireRecruitment;
