const Card = require('../../Card.js');

class PraefectusLudo extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card !== context.source && card.type === 'creature',
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.removeAmber({ all: true })
            })
        });
    }
}

PraefectusLudo.id = 'praefectus-ludo';

module.exports = PraefectusLudo;
