const Card = require('../../Card.js');

class TermsOfRedress extends Card {
    // Play: Choose a friendly creature to capture 2<A>.
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

TermsOfRedress.id = 'terms-of-redress';

module.exports = TermsOfRedress;
