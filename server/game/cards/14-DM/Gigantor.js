const GiganticCard = require('../../GiganticCard.js');

class Gigantor extends GiganticCard {
    // (Play only with the other half of Gigantor.)
    // After Fight/After Reap: Purge up to 3 cards from a discard pile. For each card purged this way, draw a card.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.fight({
            reap: true,
            targets: {
                select: {
                    mode: 'select',
                    choices: {
                        Mine: () => true,
                        "Opponent's": (context) => !!context.player.opponent
                    }
                },
                cards: {
                    dependsOn: 'select',
                    activePromptTitle: 'Choose which cards to purge',
                    mode: 'upTo',
                    numCards: 3,
                    cardCondition: (card, context) =>
                        context.selects.select.choice === 'Mine'
                            ? card.owner === context.player
                            : card.owner === context.player.opponent,
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    amount: (preThenContext.targets.cards || []).length,
                    target: context.player
                }))
            })
        });
    }
}

Gigantor.id = 'gigantor';

module.exports = Gigantor;
