const Card = require('../../Card.js');

class DefenseInitiative extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.ward()
            },
            then: (preThenContext) => ({
                may: 'exalt this creature',
                gameAction: ability.actions.exalt({
                    target: preThenContext.target
                }),
                then: {
                    gameAction: ability.actions.ward({
                        target: preThenContext.target[0].neighbors
                    })
                }
            })
        });
    }
}

DefenseInitiative.id = 'defense-initiative';

module.exports = DefenseInitiative;
