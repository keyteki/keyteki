const Card = require('../../Card.js');

class TakeHostages extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.capture()
                })
            })
        });
    }
}

TakeHostages.id = 'take-hostages'; // This is a guess at what the id might be - please check it!!!

module.exports = TakeHostages;
