const Card = require('../../Card.js');

class ForgiveOrForget extends Card {
    //Play: Choose one:
    // - Archive 2 cards of different types from your discard pile.
    // - Purge up to 2 cards from each discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.discard.length > 0 ||
                (context.player.opponent && context.player.opponent.discard.length > 0),
            target: {
                mode: 'select',
                choices: {
                    'Archive 2 cards': () => true,
                    'Purge up to 2 cards': () => true
                }
            },
            then: (preThenContext) => {
                if (preThenContext.select === 'Archive 2 cards') {
                    return {
                        alwaysTriggers: true,
                        targets: {
                            first: {
                                location: 'discard',
                                controller: 'self',
                                gameAction: ability.actions.archive()
                            },
                            second: {
                                dependsOn: 'first',
                                location: 'discard',
                                controller: 'self',
                                cardCondition: (card, context) =>
                                    card !== context.targets.first &&
                                    card.type !== context.targets.first.type,
                                gameAction: ability.actions.archive()
                            }
                        }
                    };
                } else {
                    return {
                        alwaysTriggers: true,
                        targets: {
                            first: {
                                activePromptTitle: 'Select up to 2 cards from your discard',
                                location: 'discard',
                                controller: 'self',
                                numCards: 2,
                                mode: 'upTo',
                                gameAction: ability.actions.purge()
                            },
                            second: {
                                activePromptTitle: "Select up to 2 cards from opponent's discard",
                                dependsOn: 'first',
                                location: 'discard',
                                controller: 'opponent',
                                numCards: 2,
                                mode: 'upTo',
                                gameAction: ability.actions.purge()
                            }
                        }
                    };
                }
            }
        });
    }
}

ForgiveOrForget.id = 'forgive-or-forget';

module.exports = ForgiveOrForget;
