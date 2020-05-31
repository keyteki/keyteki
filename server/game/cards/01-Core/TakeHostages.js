const Card = require('../../Card.js');

class TakeHostages extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture amber after fighting with a creature until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onFight: (event) =>
                        event.attacker.controller === context.player &&
                        event.attacker.location === 'play area'
                },
                gameAction: ability.actions.capture((context) => ({
                    target: context.event.attacker
                }))
            }))
        });
    }
}

TakeHostages.id = 'take-hostages';

module.exports = TakeHostages;
