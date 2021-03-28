const Card = require('../../Card.js');

class Scout extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 2,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword({ skirmish: 1 })
                })
            },
            effect: 'give Skirmish to {0} and fight with them',
            then: (context) => ({
                gameAction: ability.actions.sequentialForEach({
                    forEach: context.target,
                    action: ability.actions.fight()
                })
            })
        });
    }
}

Scout.id = 'scout';

module.exports = Scout;
