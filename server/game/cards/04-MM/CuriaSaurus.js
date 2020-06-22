const Card = require('../../Card.js');

class CuriaSuarus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.tokens.amber,
            effect: ability.effects.gainAbility('destroyed', {
                target: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    controller: 'opponent',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: [
                        ability.actions.placeAmber((context) => ({ target: context.target })),
                        ability.actions.removeAmber((context) => ({ target: context.source }))
                    ]
                }
            })
        });
    }
}

CuriaSuarus.id = 'curia-saurus';

module.exports = CuriaSuarus;
