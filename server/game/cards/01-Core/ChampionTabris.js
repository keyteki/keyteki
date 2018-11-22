const Card = require('../../Card.js');

class ChampionTabris extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture()
        });
    }
}

ChampionTabris.id = 'champion-tabris'; // This is a guess at what the id might be - please check it!!!

module.exports = ChampionTabris;
