const Card = require('../../Card.js');

class CreedOfNature extends Card {
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
