const Card = require('../../Card.js');

class Poltergeist extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.use()
            },
            then: context => ({
                gameAction: ability.actions.destroy({ target: context.target }),
                message: '{1} destroys {3}',
                messageArgs: context.target
            })
        });
    }
}

Poltergeist.id = 'poltergeist'; // This is a guess at what the id might be - please check it!!!

module.exports = Poltergeist;
