import Card from '../../Card.js';

class PurseAPhone extends Card {
    // Keys cost -2.
    //
    // Destroyed: If Shadys is in your discard pile, return it to your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(-2)
        });

        this.destroyed({
            target: {
                cardCondition: (card) => card.name === 'Shadys',
                location: 'discard',
                gameAction: ability.actions.returnToHand({
                    location: 'discard'
                })
            }
        });
    }
}

PurseAPhone.id = 'purse-a-phone';

export default PurseAPhone;
