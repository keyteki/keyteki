const Card = require('../../Card.js');

class TermsOfRedress extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture({ amount: 2 })
            }
        });
    }
}

TermsOfRedress.id = 'terms-of-redress'; // This is a guess at what the id might be - please check it!!!

module.exports = TermsOfRedress;
