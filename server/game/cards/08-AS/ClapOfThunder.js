const Card = require('../../Card.js');

class ClapOfThunder extends Card {
    // Play: Destroy the least powerful creature. Ready and enrage the
    // most powerful creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                numCards: 1,
                cardStat: (card) => -card.power,
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.enrage()
                    ])
                }
            }
        });
    }
}

ClapOfThunder.id = 'clap-of-thunder';

module.exports = ClapOfThunder;
