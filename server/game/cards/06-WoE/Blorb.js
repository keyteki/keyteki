import Card from '../../Card.js';

class Blorb extends Card {
    // Blorb cannot reap.
    //
    // Destroyed: Return Blorb Hive from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('reap')
        });

        this.destroyed({
            target: {
                cardType: 'artifact',
                cardCondition: (card) => card.name === 'Blorb Hive',
                location: 'discard',
                gameAction: ability.actions.returnToHand((context) => ({
                    location: context.target.location
                }))
            }
        });
    }
}

Blorb.id = 'blorb';

export default Blorb;
