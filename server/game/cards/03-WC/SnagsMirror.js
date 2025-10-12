const Card = require('../../Card.js');

class SnagsMirror extends Card {
    // After a player chooses an active house, their opponent cannot choose the same house as their active house on their next turn.
    setupCardAbilities(ability) {
        // TODO: this only allows for the last house - doesn't work with multiple turns in a row
        this.houseSelected = {};

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.stopHouseChoice((player) => this.houseSelected[player.uuid])
        });

        this.reaction({
            when: {
                onChooseActiveHouse: (event) => {
                    this.houseSelected[event.player.opponent.uuid] = event.house;
                }
            },
            effect: 'none'
            // TODO: this doesn't actually get printed, but without it the overall tests fail that there's no message, but switching to gameAction: doesn't work
        });
    }
}

SnagsMirror.id = 'snag-s-mirror';

module.exports = SnagsMirror;
