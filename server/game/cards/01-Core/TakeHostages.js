const Card = require('../../Card.js');

class TakeHostages extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture amber after fighting with a creature until the end of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onFight: (event, context) => event.attacker.controller === context.player && event.attacker.location === 'play area'
                },
                gameAction: ability.actions.capture()
            })
        });
    }
}

TakeHostages.id = 'take-hostages'; // This is a guess at what the id might be - please check it!!!

module.exports = TakeHostages;
