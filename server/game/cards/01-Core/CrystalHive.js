const Card = require('../../Card.js');

class CrystalHive extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'gain 1 amber each time a creature reaps for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onReap: () => true
                },
                gameAction: ability.actions.gainAmber({ target: context.player })
            }))
        });
    }
}

CrystalHive.id = 'crystal-hive';

module.exports = CrystalHive;
