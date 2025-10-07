import Card from '../../Card.js';

class ChampionTabris extends Card {
    // Fight: Capture 1<A>.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture()
        });
    }
}

ChampionTabris.id = 'champion-tabris';

export default ChampionTabris;
