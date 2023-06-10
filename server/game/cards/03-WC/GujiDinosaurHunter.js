const Card = require('../../Card.js');

class GujiDinosaurHunter extends Card {
    // Elusive.
    // Action: Deal 2D to a creature. Deal 6D instead if it is a Dinosaur creature or has A on it.
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
