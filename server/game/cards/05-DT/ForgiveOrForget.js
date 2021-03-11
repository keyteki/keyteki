const Card = require('../../Card.js');

class ForgiveOrForget extends Card {
    //Play: Choose one:
    // • Archive 2 cards of different types from your discard pile.
    // • Purge up to 2 cards from each discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.discard.length > 0 ||
                (context.player.opponent && context.player.opponent.discard.length > 0),
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Archive 2 cards': ability.actions.addPowerCounter(),
                        'Purge up to 2 cards': ability.actions.removePowerCounter()
                    }
                },
                archive: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.player.discard.length > 0 &&
                        context.selects.action.choice === 'Archive 2 cards',
                    numCards: 2,
                    location: 'discard',
                    mode: 'exactly',
                    controller: 'self',
                    distinctCardTypes: true,
                    gameAction: ability.actions.archive()
                },
                purgeSelf: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.selects.action.choice === 'Purge up to 2 cards' &&
                        context.player.discard.length > 0,
                    numCards: 2,
                    location: 'discard',
                    mode: 'upTo',
                    controller: 'self',
                    gameAction: ability.actions.purge()
                },
                purgeOpponent: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.selects.action.choice === 'Purge up to 2 cards' &&
                        context.player.opponent &&
                        context.player.opponent.discard.length > 0,
                    numCards: 2,
                    location: 'discard',
                    mode: 'upTo',
                    controller: 'opponent',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

ForgiveOrForget.id = 'forgive-or-forget';

module.exports = ForgiveOrForget;
