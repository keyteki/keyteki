const Card = require('../../Card.js');

class FuzzyGruen extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} gain 1 amber',
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

FuzzyGruen.id = 'fuzzy-gruen';

module.exports = FuzzyGruen;
