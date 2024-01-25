const Card = require('../../Card.js');

class CountrysideCrusher extends Card {
    // After Fight: If your opponent is haunted, you may ready and
    // fight with a neighboring creature.
    //
    // Scrap: Ready and fight with the least powerful friendly creature.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            condition: (context) => context.player.opponent && context.player.opponent.isHaunted(),
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with {1}',
            effectArgs: (context) => [context.target]
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'leastStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            }
        });
    }
}

CountrysideCrusher.id = 'countryside-crusher';

module.exports = CountrysideCrusher;
