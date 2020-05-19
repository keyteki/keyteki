const Card = require('../../Card.js');

class GujiDinosaurHunter extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.dealDamage((context) => ({
                        target:
                            context.target.hasTrait('dinosaur') || context.target.hasToken('amber')
                                ? context.target
                                : [],
                        amount: 6
                    })),
                    ability.actions.dealDamage((context) => ({
                        target:
                            !context.target.hasTrait('dinosaur') &&
                            !context.target.hasToken('amber')
                                ? context.target
                                : [],
                        amount: 2
                    }))
                ]
            }
        });
    }
}

GujiDinosaurHunter.id = 'guji-dinosaur-hunter';

module.exports = GujiDinosaurHunter;
