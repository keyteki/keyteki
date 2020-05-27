const Card = require('../../Card.js');

class Extinction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                location: 'play area',
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) =>
                            context.target &&
                            card.getTraits().some((trait) => context.target.hasTrait(trait))
                    )
                }))
            },
            effect: 'destroy {0} and each creature that shares a trait with it',
            gameAction: ability.actions.gainChains()
        });
    }
}

Extinction.id = 'extinction';

module.exports = Extinction;
