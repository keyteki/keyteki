import Card from '../../Card.js';

class AvidCollecting extends Card {
    //Play: Return a friendly token creature to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.isToken(),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

AvidCollecting.id = 'avid-collecting';

export default AvidCollecting;
