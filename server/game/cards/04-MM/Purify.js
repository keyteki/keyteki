const Card = require('../../Card.js');

class Purify extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('mutant')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('mutant'),
                gameAction: ability.actions.purge()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.discard(() => {
                    let deck = preThenContext.target.controller.deck;
                    let index = deck.findIndex(
                        (card) => card.type === 'creature' && !card.hasTrait('mutant')
                    );
                    if (index > -1) {
                        return { target: deck.slice(0, index + 1) };
                    }
                    return { target: deck };
                }),
                then: () => {
                    let card = preThenContext.target.controller.deck.find(
                        (card) => card.type === 'creature' && !card.hasTrait('mutant')
                    );
                    if (card && !card.gigantic) {
                        return {
                            message: '{0} puts {3} into play',
                            messageArgs: card,
                            gameAction: ability.actions.putIntoPlay({
                                target: card
                            })
                        };
                    }
                }
            })
        });
    }
}

Purify.id = 'purify';

module.exports = Purify;
