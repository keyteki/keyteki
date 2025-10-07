import Card from '../../Card.js';

class DustImp extends Card {
    // Destroyed: Gain 2A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

DustImp.id = 'dust-imp';

export default DustImp;
