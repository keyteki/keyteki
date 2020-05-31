const Card = require('../../Card.js');

class IntoTheFray extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('brobnar'),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.gainAbility('fight', {
                        gameAction: ability.actions.ready()
                    })
                })
            },
            effect: 'give {0} a fight ability'
        });
    }
}

IntoTheFray.id = 'into-the-fray';

module.exports = IntoTheFray;
