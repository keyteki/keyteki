const Card = require('../../Card.js');

class FuzzyGruen extends Card {
    // Play: Your opponent gains 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} gain 1 amber',
            effectArgs: (context) => [context.player.opponent],
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

FuzzyGruen.id = 'fuzzy-gruen';

module.exports = FuzzyGruen;
