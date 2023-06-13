const Card = require('../../Card.js');

class CreedOfNature extends Card {
    // Omni: Destroy Creed of Nature. If you do, choose a creature. For the remainder of the turn, that creature gains skirmish and assault X. X is its power.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        effect: ability.effects.addKeyword({
                            skirmish: 1,
                            assault: context.target.power
                        })
                    }))
                }
            }
        });
    }
}

CreedOfNature.id = 'creed-of-nature';

module.exports = CreedOfNature;
