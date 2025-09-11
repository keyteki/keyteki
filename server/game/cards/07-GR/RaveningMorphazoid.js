const Card = require('../../Card.js');

class RaveningMorphazoid extends Card {
    // While you are haunted, Ravening Morphazoid gains poison and skirmish.
    //
    // After Fight/After Reap: Draw a card. Discard a card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.addKeyword({
                poison: 1,
                skirmish: 1
            })
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.draw(),
            then: {
                alwaysTriggers: true,
                target: {
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.discard()
                },
                messageArgs: (context) => [context.target]
            }
        });
    }
}

RaveningMorphazoid.id = 'ravening-morphazoid';

module.exports = RaveningMorphazoid;
