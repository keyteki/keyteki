import Card from '../../Card.js';

class TomeOfAbatement extends Card {
    // Each creature loses and cannot gain elusive, skirmish, and taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: [
                ability.effects.removeKeyword('elusive'),
                ability.effects.removeKeyword('skirmish'),
                ability.effects.removeKeyword('taunt')
            ]
        });
    }
}

TomeOfAbatement.id = 'tome-of-abatement';

export default TomeOfAbatement;
