import Card from '../../Card.js';

class BloodMoney extends Card {
    // Play: Place 2A from the common supply on an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.placeAmber({ amount: 2 })
            }
        });
    }
}

BloodMoney.id = 'blood-money';

export default BloodMoney;
