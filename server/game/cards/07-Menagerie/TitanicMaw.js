const Card = require('../../Card.js');

class TitanicMaw extends Card {
    // Enhance .
    // Attach only to a friendly Legendary Keyraken. It gains skirmish and splash-attack 3.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.addKeyword({ 'splash-attack': 3 })
            ]
        });
    }

    canAttach(card, context) {
        return (
            card &&
            card.getType() === 'creature' &&
            card.location === 'play area' &&
            card.id === 'legendary-keyraken' &&
            card.controller === context.player
        );
    }
}

TitanicMaw.id = 'titanic-maw';

module.exports = TitanicMaw;
