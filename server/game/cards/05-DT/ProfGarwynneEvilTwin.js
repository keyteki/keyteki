import Card from '../../Card.js';

class ProfGarwynneEvilTwin extends Card {
    // Skirmish.
    // Fight: You may choose a card in your archives and put it into your hand.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                optional: true,
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfGarwynneEvilTwin.id = 'prof-garwynne-evil-twin';

export default ProfGarwynneEvilTwin;
