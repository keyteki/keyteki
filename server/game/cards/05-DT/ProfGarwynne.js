import Card from '../../Card.js';

class ProfGarwynne extends Card {
    // Elusive.
    // Reap: You may choose a card in your archives and put it into your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfGarwynne.id = 'prof-garwynne';

export default ProfGarwynne;
