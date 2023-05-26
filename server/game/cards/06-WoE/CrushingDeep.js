const Card = require('../../Card.js');

class CrushingDeep extends Card {
    //Play: During your opponent's next turn, keys cost +3A for each forged key they have.
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

CrushingDeep.id = 'crushing-deep';

module.exports = CrushingDeep;
