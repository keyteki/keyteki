import Card from '../../Card.js';

class RequestDonations extends Card {
    // Play: Make a token creature. It captures 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                gameAction: ability.actions.capture((context) => ({
                    target: context.preThenEvent.card,
                    amount: 2
                }))
            }
        });
    }
}

RequestDonations.id = 'request-donations';

export default RequestDonations;
