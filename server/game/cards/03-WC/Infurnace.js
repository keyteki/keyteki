const Card = require('../../Card.js');

class Infurnace extends Card {
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
                    gameAction: [
                        ability.actions.purge(),
                        ability.actions.loseAmber((context) => ({
                            amount: context.targets.cards.reduce(
                                (acc, card) =>
                                    acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                                0
                            ),
                            target: context.player.opponent
                        }))
                    ]
                }
            }
        });
    }
}

Infurnace.id = 'infurnace';

module.exports = Infurnace;
