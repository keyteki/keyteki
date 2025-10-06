const Card = require('../../Card.js');
// const EventRegistrar = require('../../eventregistrar.js');

class SnagsMirror extends Card {
    // After a player chooses an active house, their opponent cannot choose the same house as their active house on their next turn.
    setupCardAbilities(ability) {
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
            }
        });
    }
}

SnagsMirror.id = 'snag-s-mirror';

module.exports = SnagsMirror;
