import Card from '../../Card.js';

class GenerousOffer extends Card {
    //Play: Destroy a friendly creature. If you do, steal 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.steal({ amount: 2 })
            }
        });
    }
}

GenerousOffer.id = 'generous-offer';

export default GenerousOffer;
