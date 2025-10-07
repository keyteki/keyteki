import Card from '../../Card.js';

class MasterOf1 extends Card {
    // Reap: You may destroy a creature with 1 power.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power === 1,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

MasterOf1.id = 'master-of-1';

export default MasterOf1;
