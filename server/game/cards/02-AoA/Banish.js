import Card from '../../Card.js';

class Banish extends Card {
    // Play: Put an enemy creature into your opponents archives.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Banish.id = 'banish';

export default Banish;
