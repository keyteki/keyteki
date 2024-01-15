const Card = require('../../Card.js');

class Portalmonster extends Card {
    // If you are haunted, keys cost +1 for each card in your discard
    // pile. Otherwise, keys cost -2.
    //
    // Destroyed: If you are haunted, archive Portalmonster.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost((_, context) => {
                return context.source.controller.isHaunted()
                    ? context.source.controller.discard.length
                    : -2;
            })
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

Portalmonster.id = 'portalmonster';

module.exports = Portalmonster;
