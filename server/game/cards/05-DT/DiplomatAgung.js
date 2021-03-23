const Card = require('../../Card.js');

class DiplomatAgung extends Card {
    //Play/Fight/Reap: For the remainder of your turn, a friendly creature belongs to the house of your choice in addition to its other houses.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            targets: {
                selectedHouse: {
                    mode: 'house'
                },
                targetCreature: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        effect: ability.effects.addHouse(context.targets.selectedHouse),
                        target: context.targets.targetCreature
                    }))
                }
            }
        });
    }
}

DiplomatAgung.id = 'diplomat-agung';

module.exports = DiplomatAgung;
