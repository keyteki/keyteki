const Card = require('../../Card.js');

class YanthiGhostfin extends Card {
    //After Reap: Purge a creature from a discard pile. If you do, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.sequential([
                    ability.actions.enrage(),
                    ability.actions.capture((context) => ({
                        amount: 1,
                        player: context.player.opponent
                    }))
                ])
            }
        });
    }
}

YanthiGhostfin.id = 'yanthi-ghostfin';

module.exports = YanthiGhostfin;
