import Card from '../../Card.js';

class CaptainKresageEvilTwin extends Card {
    // Each creature loses elusive, taunt, poison, and skirmish.
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

export default CaptainKresageEvilTwin;
