import Card from '../../Card.js';

class ShortysBrew extends Card {
    // Play: Give a creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

ShortysBrew.id = 'shorty-s-brew';

export default ShortysBrew;
