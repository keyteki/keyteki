import Card from '../../Card.js';

class Headhunter extends Card {
    // Fight: Gain 1<A>.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber()
        });
    }
}

Headhunter.id = 'headhunter';

export default Headhunter;
