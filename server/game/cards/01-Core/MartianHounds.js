const Card = require('../../Card.js');

class MartianHounds extends Card {
    // Play: Choose a creature. For each damaged creature, give the chosen creature two +1power counters.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount:
                        context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
                            .length * 2
                }))
            }
        });
    }
}

MartianHounds.id = 'martian-hounds';

module.exports = MartianHounds;
