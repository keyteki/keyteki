const Card = require('../../Card.js');

class TyaArhiEsquire extends Card {
    // Each friendly non-token creature gains, "Destroyed: Make a
    // token creature.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && !card.isToken(),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.makeTokenCreature()
            })
        });
    }
}

TyaArhiEsquire.id = 'tya-arhĭ-esquire';

module.exports = TyaArhiEsquire;
