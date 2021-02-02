const Card = require('../../Card.js');

class CaptainKresageEvilTwin extends Card {
    //All creatures lose elusive, taunt, poison and skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: [
                ability.effects.removeKeyword('elusive'),
                ability.effects.removeKeyword('taunt'),
                ability.effects.removeKeyword('poison'),
                ability.effects.removeKeyword('skirmish')
            ]
        });
    }
}

CaptainKresageEvilTwin.id = 'captain-kresage-evil-twin';

module.exports = CaptainKresageEvilTwin;
