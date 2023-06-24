const Card = require('../../Card.js');

class BattlefieldEvangelist extends Card {
    //After Fight: Make a token creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

BattlefieldEvangelist.id = 'battlefield-evangelist';

module.exports = BattlefieldEvangelist;
