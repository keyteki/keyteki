import Card from '../../Card.js';

class ChanelTheWise extends Card {
    // Each other friendly creature gets +3 power.
    // Scrap: Give a friendly creature five +1 power counters.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card !== this && card.type === 'creature',
            effect: ability.effects.modifyPower(3)
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter({ amount: 5 })
            }
        });
    }
}

ChanelTheWise.id = 'chanel-the-wise';

export default ChanelTheWise;
