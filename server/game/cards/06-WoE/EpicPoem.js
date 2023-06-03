const Card = require('../../Card.js');
class EpicPoem extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: false,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.exalt(),
                    ability.actions.gainAmber((context) => ({
                        amount: context.target.amber,
                        target: context.player
                    }))
                ])
            }
        });
    }
}

EpicPoem.id = 'epic-poem';
module.exports = EpicPoem;
