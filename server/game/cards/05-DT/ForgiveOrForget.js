const Card = require('../../Card.js');

class ForgiveOrForget extends Card {
    // Play: Choose one:
    //  Archive 2 cards of different types from your discard pile.
    //  Purge up to 2 cards from each discard pile.
    reduceTargets(context) {
        let targets = context.targets
            ? Object.values(context.targets).reduce((acc, target) => acc.concat(target), [])
            : [];
        return targets.length === 0 ? 'nothing' : targets;
    }

    // Play: Choose one:
    // • Archive 2 cards of different types from your discard pile.
    // • Purge up to 2 cards from each discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.discard.length > 0 ||
                (context.player.opponent && context.player.opponent.discard.length > 0),
            effect: '{1}{2}',
            effectArgs: (context) =>
                context.selects.action && context.selects.action.choice === 'Archive 2 cards'
                    ? ['archive ', this.reduceTargets(context)]
                    : ['purge ', this.reduceTargets(context)],
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Archive 2 cards': () => true,
                        'Purge up to 2 cards': () => true
                    }
                },
                'Archive 2 cards.first': {
                    dependsOn: 'action',
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                'Archive 2 cards.second': {
                    dependsOn: 'action',
                    location: 'discard',
                    controller: 'self',
                    cardCondition: (card, context) =>
                        context.targets['Archive 2 cards.first'] &&
                        card !== context.targets['Archive 2 cards.first'] &&
                        card.type !== context.targets['Archive 2 cards.first'].type,
                    gameAction: ability.actions.archive()
                },
                'Purge up to 2 cards.own': {
                    dependsOn: 'action',
                    activePromptTitle: 'Select up to 2 cards from your discard',
                    location: 'discard',
                    controller: 'self',
                    numCards: 2,
                    mode: 'upTo',
                    gameAction: ability.actions.purge()
                },
                'Purge up to 2 cards.opponent': {
                    activePromptTitle: "Select up to 2 cards from opponent's discard",
                    dependsOn: 'action',
                    location: 'discard',
                    controller: 'opponent',
                    numCards: 2,
                    mode: 'upTo',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

ForgiveOrForget.id = 'forgive-or-forget';

module.exports = ForgiveOrForget;
