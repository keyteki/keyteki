const Card = require('../../Card.js');

class ThrowingStars extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: context => ({
                gameAction: ability.actions.gainAmber(() => ({
                    amount: context.targets.target.filter(target => target.location !== 'play area').length
                })),
                message: 'and gain amber for each creature destroyed this way'
            })
        });
    }
}

ThrowingStars.id = 'throwing-stars';

module.exports = ThrowingStars;
