import Card from '../../Card.js';

class ChandlerAnouk extends Card {
    // Each friendly flank creature gets +2 armor and gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.isOnFlank(),
            effect: [ability.effects.modifyArmor(2), ability.effects.addKeyword({ taunt: 1 })]
        });
    }
}

ChandlerAnouk.id = 'chandler-anouk';

export default ChandlerAnouk;
