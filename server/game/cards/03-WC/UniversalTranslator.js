const Card = require('../../Card.js');

class UniversalTranslator extends Card {
    // This creature gains, "Fight/Reap: Use a friendly non-Star Alliance creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('fight', {
                    target: {
                        numCards: 1,
                        optional: false,
                        cardCondition: (card) => !card.hasHouse('staralliance'),
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.use()
                    }
                }),
                ability.effects.gainAbility('reap', {
                    target: {
                        numCards: 1,
                        optional: false,
                        cardCondition: (card) => !card.hasHouse('staralliance'),
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.use()
                    }
                })
            ]
        });
    }
}

UniversalTranslator.id = 'universal-translator';

module.exports = UniversalTranslator;
