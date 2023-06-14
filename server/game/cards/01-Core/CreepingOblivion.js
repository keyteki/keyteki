const Card = require('../../Card.js');

class CreepingOblivion extends Card {
    // Play: Purge up to 2cards from a discard pile.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle: 'Choose which discard pile to purge from',
                    choices: {
                        Mine: (context) => context.player.discard.length > 0,
                        "Opponent's": (context) =>
                            context.player.opponent && context.player.opponent.discard.length > 0
                    }
                },
                cards: {
                    dependsOn: 'select',
                    mode: 'upTo',
                    numCards: 2,
                    cardCondition: (card, context) =>
                        context.selects.select.choice === 'Mine'
                            ? card.owner === context.player
                            : card.owner === context.player.opponent,
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

CreepingOblivion.id = 'creeping-oblivion';

module.exports = CreepingOblivion;
