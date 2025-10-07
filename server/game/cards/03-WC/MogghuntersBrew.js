import Card from '../../Card.js';

class MogghuntersBrew extends Card {
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

MogghuntersBrew.id = 'mogghunter-s-brew';

export default MogghuntersBrew;
