const Card = require('../../Card.js');

class GauntletOfCommand extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            }
        });
    }
}

GauntletOfCommand.id = 'gauntlet-of-command'; // This is a guess at what the id might be - please check it!!!

module.exports = GauntletOfCommand;
