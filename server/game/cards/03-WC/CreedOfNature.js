const Card = require('../../Card.js');

class CreedOfNature extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                optional: false,
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword('skirmish')
                })
            },
            then: context => ({
                gameAction: [
                    ability.actions.cardLastingEffect({
                        target: context.target,
                        effect: ability.effects.addKeyword({ assault: 4 })
                    }),
                    ability.actions.sacrifice()
                ]
            })
        });
    }
}

CreedOfNature.id = 'creed-of-nature';

module.exports = CreedOfNature;
