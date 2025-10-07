import Card from '../../Card.js';

class ComOfficerPalik extends Card {
    // Versatile. (This card may be used as if it belonged to the active house.)
    //
    // After Fight/After Reap: A friendly creature captures 1.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

ComOfficerPalik.id = 'com-officer-palik';

export default ComOfficerPalik;
