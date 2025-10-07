import Card from '../../Card.js';

class Chronophage extends Card {
    // Your opponent's creatures and artifacts gain omega. (After they play that card, end the current step.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            targetController: 'opponent',
            match: (card) => card.type === 'creature' || card.type === 'artifact',
            effect: ability.effects.addKeyword({ omega: 1 })
        });
    }
}

Chronophage.id = 'chronophage';

export default Chronophage;
