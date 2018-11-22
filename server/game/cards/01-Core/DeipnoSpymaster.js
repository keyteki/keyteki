const Card = require('../../Card.js');

class DeipnoSpymaster extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.forRemainderOfTurn(context => ({
                    effect: ability.effects.canUse(card => card === context.target)
                }))
            },
            effect: 'allow {0} to be used for the remainder of the turn'
        });
    }
}

DeipnoSpymaster.id = 'deipno-spymaster'; // This is a guess at what the id might be - please check it!!!

module.exports = DeipnoSpymaster;
