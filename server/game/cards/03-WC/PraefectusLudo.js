const Card = require('../../Card.js');

class PraefectusLudo extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card !== this && card.type === 'creature',
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.removeAmber({ all: true })
            })
        });
    }
}

PraefectusLudo.id = 'praefectus-ludo';

module.exports = PraefectusLudo;
