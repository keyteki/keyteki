const Card = require('../../Card.js');

class AubadeTheGrim extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
        this.reap({
            condition: context => context.source.hasToken('amber'),
            effect: 'move 1 amber from Aubade the Grim to the pool',
            then:{
                gameAction: ability.actions.removeAmber({
                    // AUGH WHY DOESNT THIS WORK
                    target: this,
                    amount: 1
                })
            }
        });
    }
}

AubadeTheGrim.id = 'aubade-the-grim';

module.exports = AubadeTheGrim;
